import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SubStatus } from '@prisma/client';

export interface CreateCustomerDto {
  email: string;
  name: string;
  tenantId: string;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCustomer(data: CreateCustomerDto): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          tenantId: data.tenantId,
        },
      });

      this.logger.log(
        `Customer created: ${customer.id} for tenant: ${data.tenantId}`,
      );
      return customer;
    } catch (error) {
      this.logger.error(
        `Failed to create customer: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create customer');
    }
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription =
        await this.stripe.subscriptions.cancel(subscriptionId);
      this.logger.log(`Subscription canceled: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      this.logger.error(
        `Failed to cancel subscription: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  async updateSubscription(
    subscriptionId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      const updatedSubscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: priceId,
            },
          ],
          proration_behavior: 'create_prorations',
        },
      );

      this.logger.log(`Subscription updated: ${subscriptionId}`);
      return updatedSubscription;
    } catch (error) {
      this.logger.error(
        `Failed to update subscription: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to update subscription');
    }
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'items.data.price.product'],
      });
    } catch (error) {
      this.logger.error(
        `Failed to retrieve subscription: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException('Subscription not found');
    }
  }

  async constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionChange(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to handle webhook event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handleSubscriptionChange(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      this.logger.warn(
        `No tenantId found in subscription metadata: ${subscription.id}`,
      );
      return;
    }

    const status = this.mapStripeStatusToSubStatus(subscription.status);
    const startedAt = new Date(
      (subscription as any).current_period_start * 1000,
    );
    const expiresAt = new Date((subscription as any).current_period_end * 1000);

    // Buscar o plano baseado no produto do Stripe
    const priceId = subscription.items.data[0]?.price?.id;
    if (!priceId) {
      this.logger.warn(`No price ID found in subscription: ${subscription.id}`);
      return;
    }

    const plan = await this.prisma.plan.findFirst({
      where: { stripePriceId: priceId },
    });

    if (!plan) {
      this.logger.warn(`No plan found for Stripe price: ${priceId}`);
      return;
    }

    await this.prisma.subscription.upsert({
      where: { tenantId },
      update: {
        status,
        startedAt,
        expiresAt,
        renewedAt: new Date(),
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        planId: plan.id,
      },
      create: {
        tenantId,
        planId: plan.id,
        status,
        startedAt,
        expiresAt,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
      },
    });

    this.logger.log(`Subscription updated in database for tenant: ${tenantId}`);
  }

  private async handleSubscriptionCanceled(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      this.logger.warn(
        `No tenantId found in subscription metadata: ${subscription.id}`,
      );
      return;
    }

    await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        status: SubStatus.CANCELED,
        canceledAt: new Date(),
      },
    });

    this.logger.log(
      `Subscription canceled in database for tenant: ${tenantId}`,
    );
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if ((invoice as any).subscription) {
      const subscription = await this.stripe.subscriptions.retrieve(
        (invoice as any).subscription as string,
      );
      await this.handleSubscriptionChange(subscription);
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if ((invoice as any).subscription) {
      const subscriptionId = (invoice as any).subscription as string;
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      const tenantId = subscription.metadata?.tenantId;

      if (tenantId) {
        await this.prisma.subscription.update({
          where: { tenantId },
          data: {
            status: SubStatus.PAST_DUE,
          },
        });

        this.logger.log(
          `Subscription marked as past due for tenant: ${tenantId}`,
        );
      }
    }
  }

  private mapStripeStatusToSubStatus(stripeStatus: string): SubStatus {
    switch (stripeStatus) {
      case 'active':
        return SubStatus.ACTIVE;
      case 'past_due':
        return SubStatus.PAST_DUE;
      case 'canceled':
      case 'unpaid':
        return SubStatus.CANCELED;
      case 'incomplete_expired':
        return SubStatus.EXPIRED;
      default:
        return SubStatus.CANCELED;
    }
  }

  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<string> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url || '';
    } catch (error) {
      this.logger.error(
        `Failed to create billing portal session: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create billing portal session');
    }
  }

  async createCheckoutSession(
    priceId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      });

      return session.url || '';
    } catch (error) {
      this.logger.error(
        `Failed to create checkout session: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  // Handle Stripe checkout completion - create company after payment confirmed
  async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    this.logger.log('🎉 Checkout session completed', { sessionId: session.id });

    // Extract company data from metadata
    const metadata = session.metadata;
    if (!metadata) {
      this.logger.error('No metadata found in checkout session');
      return;
    }

    const { companyName, contactName, contactEmail, domain, planId } = metadata;

    if (!companyName || !contactName || !contactEmail || !domain || !planId) {
      this.logger.error(
        'Missing required data in checkout session metadata',
        metadata,
      );
      return;
    }

    try {
      // Get plan details
      const plan = await this.prisma.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        this.logger.error(`Plan not found: ${planId}`);
        return;
      }

      // Create the tenant
      const tenant = await this.prisma.tenant.create({
        data: {
          name: companyName,
          slug: domain,
        },
      });

      // Create admin user
      const temporaryPassword = this.generateTemporaryPassword();
      const hashedPassword = await this.hash(temporaryPassword, 10);

      const user = await this.prisma.user.create({
        data: {
          tenantId: tenant.id,
          name: contactName,
          email: contactEmail,
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
        },
      });

      // Create usage record
      await this.prisma.usage.create({
        data: {
          tenantId: tenant.id,
          propertiesCount: 0,
          contactsCount: 0,
        },
      });

      // Create subscription with customer from session
      await this.prisma.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: plan.id,
          status: 'ACTIVE',
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        },
      });

      // Send welcome email with credentials
      const planFeatures = this.getPlanFeatures(plan.name);

      await this.emailService.sendWelcomeEmail({
        companyName,
        contactName,
        contactEmail,
        temporaryPassword,
        domain,
        subdomain: domain,
        tenantId: tenant.id,
        plan: plan.name,
        planName: plan.name,
        planFeatures,
      });

      this.logger.log('✅ Company created successfully after payment', {
        tenantId: tenant.id,
        userId: user.id,
        plan: plan.name,
      });
    } catch (error) {
      this.logger.error(
        'Failed to create company after checkout completion:',
        error,
      );
      // TODO: Add error handling - maybe send notification to admin
    }
  }

  private generateTemporaryPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&*';

    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < 10; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  private async hash(data: string, rounds: number): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(data, rounds);
  }

  private getPlanFeatures(planName: string): string {
    switch (planName.toUpperCase()) {
      case 'STARTER':
        return 'Até 50 usuários, 1.000 propriedades, 5.000 contatos';
      case 'PROFESSIONAL':
        return 'Até 200 usuários, 10.000 propriedades, 50.000 contatos + API';
      case 'ENTERPRISE':
        return 'Usuários ilimitados, propriedades ilimitadas, contatos ilimitados + API Premium';
      default:
        return '';
    }
  }
}
