import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SignupDto, PlanType } from './dto/signup.dto';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class SignupService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async signup(dto: SignupDto) {
    // Verificar se o domínio já existe
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.domain },
    });

    if (existingTenant) {
      throw new ConflictException('User already exists');
    }

    // Verificar se já existe um usuário com este email
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.contactEmail },
    });

    if (existingUser) {
      throw new ConflictException('This email is already registered');
    }

    // Criar o tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.companyName,
        slug: dto.domain,
      },
    });

    // Buscar ou criar o plano
    let plan = await this.prisma.plan.findUnique({
      where: { name: dto.plan },
    });

    if (!plan) {
      // Criar planos padrão se não existirem
      const planData = this.getPlanData(dto.plan);
      plan = await this.prisma.plan.create({
        data: planData,
      });
    }

    // Criar a assinatura
    await this.prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: plan.id,
        status: 'ACTIVE',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
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

    try {
      await this.emailService.sendWelcomeEmail({
        companyName: dto.companyName,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        domain: dto.domain,
        plan: this.getPlanDisplayName(dto.plan),
        subdomain: dto.domain,
        temporaryPassword: temporaryPassword,
      });
    } catch (error) {
      console.error(
        '❌ Erro no SignupService ao enviar email de boas-vindas:',
        {
          error: error.message,
          email: dto.contactEmail,
          empresa: dto.companyName,
        },
      );
      // Não falhar o signup se o email falhar, apenas logar o erro
    }

    return {
      success: true,
      message:
        'Cadastro realizado com sucesso! Verifique seu email para acessar a plataforma com suas credenciais.',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: plan.name,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      credentials: {
        email: dto.contactEmail,
        passwordSentByEmail: true,
        loginUrl: `http://localhost:3000/login?tenant=${dto.domain}`,
      },
    };
  }

  private generateTemporaryPassword(): string {
    // Caracteres por categoria
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&*+-=?';

    // Garantir pelo menos 1 de cada categoria (4 caracteres)
    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    // Completar até 12 caracteres com caracteres aleatórios de todas as categorias
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Embaralhar a senha para que os caracteres obrigatórios não fiquem sempre no início
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  private getPlanData(planType: PlanType) {
    const plans = {
      [PlanType.STARTER]: {
        name: 'STARTER',
        price: 149.0,
        currency: 'BRL',
        maxUsers: 5,
        maxProperties: 100,
        maxContacts: 1000,
        hasAPI: false,
        description: 'Perfeito para pequenos negócios',
      },
      [PlanType.PROFESSIONAL]: {
        name: 'PROFESSIONAL',
        price: 299.0,
        currency: 'BRL',
        maxUsers: 20,
        maxProperties: 500,
        maxContacts: 5000,
        hasAPI: true,
        description: 'Ideal para empresas em crescimento',
      },
      [PlanType.ENTERPRISE]: {
        name: 'ENTERPRISE',
        price: 599.0,
        currency: 'BRL',
        maxUsers: null, // ilimitado
        maxProperties: null, // ilimitado
        maxContacts: null, // ilimitado
        hasAPI: true,
        description: 'Para empresas de grande porte',
      },
    };
    return plans[planType];
  }

  private getPlanDisplayName(plan: PlanType): string {
    const planNames = {
      [PlanType.STARTER]: 'Starter',
      [PlanType.PROFESSIONAL]: 'Professional',
      [PlanType.ENTERPRISE]: 'Enterprise',
    };
    return planNames[plan];
  }
}
