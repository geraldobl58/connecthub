import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { StripeService } from '../stripe/stripe.service';
import { SignupDto, PlanType, SignupResponseDto } from './dto/signup.dto';
import { hash } from 'bcrypt';
import { Role, SubStatus } from '@prisma/client';

@Injectable()
export class SignupService {
  private readonly logger = new Logger(SignupService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private stripeService: StripeService,
  ) {}

  async signup(dto: SignupDto): Promise<SignupResponseDto> {
    this.logger.log('🚀 Starting signup process', { 
      domain: dto.domain, 
      plan: dto.plan,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl 
    });

    // Verificar se o domínio já existe
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.domain },
    });

    if (existingTenant) {
      throw new ConflictException('Este domínio já está em uso');
    }

    // Verificar se já existe um usuário com este email
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.contactEmail },
    });

    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado');
    }

    // Buscar o plano escolhido
    const plan = await this.prisma.plan.findFirst({
      where: { 
        name: {
          equals: dto.plan,
          mode: 'insensitive'
        }
      },
    });

    if (!plan) {
      throw new NotFoundException(`Plano ${dto.plan} não encontrado`);
    }

    // Criar o tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.companyName,
        slug: dto.domain,
      },
    });

    // Criar o usuário administrador
    const temporaryPassword = this.generateTemporaryPassword();
    const hashedPassword = await hash(temporaryPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: dto.contactName,
        email: dto.contactEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
      },
    });

    // Criar registro de uso
    await this.prisma.usage.create({
      data: {
        tenantId: tenant.id,
        propertiesCount: 0,
        contactsCount: 0,
      },
    });

    let checkoutUrl: string | undefined;
    let subscriptionStatus: SubStatus = SubStatus.ACTIVE;

    // Se o plano é pago (não é STARTER), criar customer e checkout session
    if (dto.plan !== PlanType.STARTER) {
      try {
        // Criar customer no Stripe
        const customer = await this.stripeService.createCustomer({
          email: dto.contactEmail,
          name: dto.companyName,
          tenantId: tenant.id,
        });

        // Criar checkout session
        const successUrl = dto.successUrl || `https://${dto.domain}.connecthub.com/dashboard?payment=success`;
        const cancelUrl = dto.cancelUrl || `https://${dto.domain}.connecthub.com/plans?payment=cancelled`;
        
        this.logger.log('🏪 Creating Stripe checkout session', {
          planId: plan.id,
          stripePriceId: plan.stripePriceId,
          customerId: customer.id,
          successUrl,
          cancelUrl,
          rawSuccessUrl: dto.successUrl,
          rawCancelUrl: dto.cancelUrl
        });
        
        checkoutUrl = await this.stripeService.createCheckoutSession(
          plan.stripePriceId!,
          customer.id,
          successUrl,
          cancelUrl,
          { tenantId: tenant.id }
        );

        this.logger.log('✅ Stripe checkout session created', { checkoutUrl });

        // Para planos pagos, iniciar com status PENDING até o pagamento ser confirmado
        subscriptionStatus = SubStatus.PENDING;

        // Criar a assinatura com customer ID
        await this.prisma.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: plan.id,
            status: subscriptionStatus,
            startedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            stripeCustomerId: customer.id,
          },
        });

      } catch (error) {
        console.error('Erro ao criar checkout Stripe:', error);
        // Se falhar no Stripe, ainda criar a assinatura como trial
        await this.prisma.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: plan.id,
            status: SubStatus.ACTIVE,
            startedAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias de trial
          },
        });
      }
    } else {
      // Para plano STARTER, criar assinatura diretamente ativa
      await this.prisma.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: plan.id,
          status: SubStatus.ACTIVE,
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      });
    }

    // Definir recursos do plano para o email
    const getPlanFeatures = (planName: string) => {
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
    };

    // Enviar email de boas-vindas
    try {
      await this.emailService.sendWelcomeEmail({
        companyName: dto.companyName,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        temporaryPassword,
        domain: dto.domain,
        subdomain: dto.domain,
        plan: plan.name,
        planName: plan.name,
        planFeatures: getPlanFeatures(plan.name),
      });
    } catch (error) {
      this.logger.error('Erro ao enviar email de boas-vindas:', error);
      // Não falhar o signup se o email não for enviado
    }

    return {
      success: true,
      message: checkoutUrl 
        ? 'Empresa criada com sucesso. Complete o pagamento para ativar sua assinatura.'
        : 'Empresa criada com sucesso. Verifique seu email para acessar sua conta.',
      tenantId: tenant.id,
      checkoutUrl,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
      },
    };
  }

  private generateTemporaryPassword(): string {
    // Definir caracteres por categoria
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&*';
    
    // Garantir que pelo menos um caractere de cada categoria seja incluído
    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Preencher o restante da senha com caracteres aleatórios de todas as categorias
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < 10; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Embaralhar a senha para que os caracteres obrigatórios não fiquem sempre no início
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
