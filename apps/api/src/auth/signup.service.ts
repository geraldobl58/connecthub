import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { StripeService } from '../stripe/stripe.service';
import { PlansService } from '../plans/plans.service';
import { SignupDto, SignupResponseDto } from './dto/signup.dto';
import { hash } from 'bcrypt';

@Injectable()
export class SignupService {
  private readonly logger = new Logger(SignupService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private stripeService: StripeService,
    private plansService: PlansService,
  ) {}

  async signup(dto: SignupDto): Promise<SignupResponseDto> {
    this.logger.log('🚀 Starting signup process', {
      domain: dto.domain,
      plan: dto.plan,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
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
          mode: 'insensitive',
        },
      },
    });

    if (!plan) {
      throw new NotFoundException(`Plano ${dto.plan} não encontrado`);
    }

    // Para plano TRIAL, criar empresa diretamente sem Stripe
    if (plan.name.toUpperCase() === 'TRIAL') {
      return await this.createCompanyDirectly(dto, plan);
    }

    // Para planos pagos, criar sessão do Stripe
    return await this.createStripeCheckoutSession(dto, plan);
  }

  // Criar empresa diretamente (para planos TRIAL e alguns pagos)
  private async createCompanyDirectly(
    dto: SignupDto,
    plan: any,
  ): Promise<SignupResponseDto> {
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
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        tenantId: true,
      },
    });

    // Calcular data de expiração baseada no plano
    let expiresAt: Date;
    if (plan.name.toUpperCase() === 'TRIAL' && plan.trialDurationHours) {
      // Para TRIAL: adicionar horas
      expiresAt = new Date(
        Date.now() + plan.trialDurationHours * 60 * 60 * 1000,
      );
    } else {
      // Para outros planos: 30 dias
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    // Criar assinatura com status ACTIVE
    await this.prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: plan.id,
        status: 'ACTIVE',
        startedAt: new Date(),
        expiresAt,
      },
    });

    // Definir recursos do plano para o email
    const getPlanFeatures = (planName: string) => {
      const upperPlan = planName.toUpperCase();
      switch (upperPlan) {
        case 'TRIAL':
          return `Até 2 horas de teste grátis com 4 usuários, 3 propriedades e 10 contatos`;
        case 'STARTER':
          return 'Até 4 usuários, 3 propriedades, 10 contatos';
        case 'PROFESSIONAL':
          return 'Até 4 usuários, 10 propriedades, 20 contatos + API';
        case 'ENTERPRISE':
          return 'Até 4 usuários, 50 propriedades, 30 contatos + API';
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
        tenantId: tenant.id,
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
      message:
        'Empresa criada com sucesso. Verifique seu email para acessar sua conta.',
      tenantId: tenant.id,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'ADMIN',
      },
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
      },
      isTrial: true,
    };
  }

  // Criar sessão do Stripe (para planos pagos)
  private async createStripeCheckoutSession(
    dto: SignupDto,
    plan: any,
  ): Promise<SignupResponseDto> {
    let customer: any;
    try {
      // Criar customer no Stripe
      customer = await this.stripeService.createCustomer({
        email: dto.contactEmail,
        name: dto.companyName,
        tenantId: '', // Vazio por enquanto
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const successUrl = dto.successUrl || `${baseUrl}/auth/success`;
      const cancelUrl = dto.cancelUrl || `${baseUrl}/auth/register`;

      this.logger.log('🏪 Creating Stripe checkout session', {
        planId: plan.id,
        stripePriceId: plan.stripePriceId,
        customerId: customer.id,
        successUrl,
        cancelUrl,
      });

      // Limpar sessões de checkout expiradas ou não completadas do mesmo domínio
      await this.prisma.stripeCheckoutSession.deleteMany({
        where: {
          domain: dto.domain,
          OR: [
            {
              expiresAt: {
                lt: new Date(),
              },
            },
            {
              completed: false,
            },
          ],
        },
      });

      // Gerar token de sucesso único
      const successToken = this.generateSuccessToken();

      // Armazenar dados temporários na sessão do Stripe para webhook
      const metadata = {
        companyName: dto.companyName,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        domain: dto.domain,
        planId: plan.id,
        planName: plan.name,
        successToken, // Token será usado no webhook
      };

      const checkoutSession = await this.stripeService.createCheckoutSession(
        plan.stripePriceId,
        customer.id,
        successUrl,
        cancelUrl,
        metadata,
      );

      // Armazenar sessão de checkout para rastreamento
      await this.prisma.stripeCheckoutSession.create({
        data: {
          sessionId: checkoutSession.id,
          stripeCustomerId: customer.id,
          companyName: dto.companyName,
          contactName: dto.contactName,
          contactEmail: dto.contactEmail,
          domain: dto.domain,
          planId: plan.id,
          planName: plan.name,
          successToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira em 24h
        },
      });

      this.logger.log('✅ Stripe checkout session created', {
        sessionId: checkoutSession.id,
        checkoutUrl: checkoutSession.url,
      });

      return {
        success: true,
        message:
          'Sessão de pagamento criada. Você será redirecionado para o Stripe.',
        checkoutUrl: checkoutSession.url,
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          currency: plan.currency,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('❌ Erro ao criar checkout Stripe:', {
        error: errorMessage,
        plan: dto.plan,
        stripePriceId: plan.stripePriceId,
        customerId: customer?.id || 'unknown',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(`Erro ao processar pagamento. Detalhes: ${errorMessage}`);
    }
  }

  private generateSuccessToken(): string {
    const part1 = Math.random().toString(36).substring(2, 15);
    const part2 = Math.random().toString(36).substring(2, 15);
    return part1 + part2;
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
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
