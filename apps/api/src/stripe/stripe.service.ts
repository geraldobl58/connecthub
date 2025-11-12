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
import { AutoUpgradeService } from './auto-upgrade.service';
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
    private autoUpgradeService: AutoUpgradeService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }

    this.stripe = new Stripe(secretKey);
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
      throw new BadRequestException('Falha ao criar cliente');
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
      throw new BadRequestException('Falha ao cancelar assinatura');
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
      throw new BadRequestException('Falha ao atualizar assinatura');
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
      throw new NotFoundException('Assinatura não encontrada');
    }
  }

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
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
      throw new BadRequestException('Assinatura de webhook inválida');
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
    this.logger.log('🔄 Processing subscription change', {
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    // Delegar para o AutoUpgradeService que processa o upgrade automaticamente
    const result =
      await this.autoUpgradeService.processAutoUpgrade(subscription);

    if (result) {
      this.logger.log('✅ Auto-upgrade completed', {
        tenantId: result.tenantId,
        oldPlan: result.oldPlanName,
        newPlan: result.newPlanName,
        message: result.message,
      });
    } else {
      this.logger.warn('⚠️ Auto-upgrade returned no result');
    }
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

    // Fetch subscription with related data
    const dbSubscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true, tenant: true },
    });

    if (!dbSubscription) {
      this.logger.warn(
        `Subscription not found in database for tenant: ${tenantId}`,
      );
      return;
    }

    // Update subscription status
    await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        status: SubStatus.CANCELED,
        canceledAt: new Date(),
      },
    });

    // Fetch admin user for email
    const adminUser = await this.prisma.user.findFirst({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // Send cancellation email
    if (adminUser) {
      try {
        const expirationDate = dbSubscription.expiresAt
          ? new Date(dbSubscription.expiresAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Data não disponível';

        await this.emailService.sendCancellationEmail({
          companyName: dbSubscription.tenant.name,
          contactName: adminUser.name || adminUser.email,
          contactEmail: adminUser.email,
          planName: dbSubscription.plan.name,
          expirationDate,
        });

        this.logger.log(`Cancellation email sent for tenant: ${tenantId}`);
      } catch (emailError) {
        this.logger.error(
          `Failed to send cancellation email for tenant ${tenantId}: ${emailError.message}`,
        );
        // Continue execution even if email fails
      }
    }

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
      throw new BadRequestException(
        'Falha ao criar sessão do portal de cobrança',
      );
    }
  }

  async createCheckoutSession(
    priceId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
  ): Promise<{ url: string; id: string }> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
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

      return {
        url: session.url || '',
        id: session.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create checkout session: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Falha ao criar sessão de checkout');
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
          isActive: true,
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
        return 'Até 4 usuários, 3 propriedades, 10 contatos';
      case 'PROFESSIONAL':
        return 'Até 4 usuários, 10 propriedades, 20 contatos + API';
      case 'ENTERPRISE':
        return 'Até 4 usuários, 50 propriedades, 30 contatos + API';
      default:
        return '';
    }
  }
}
