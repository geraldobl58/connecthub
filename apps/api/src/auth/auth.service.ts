import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TwoFactorService } from '../two-factor/two-factor.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
    private twoFactorService: TwoFactorService,
    private configService: ConfigService,
  ) {
    // Configurar Cloudinary
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      // Parse da URL: cloudinary://api_key:api_secret@cloud_name
      const url = new URL(cloudinaryUrl);
      cloudinary.config({
        cloud_name: url.hostname,
        api_key: url.username,
        api_secret: url.password,
      });
    }
  }

  async signIn(
    email: string,
    password: string,
    tenantId: string,
    twoFactorToken?: string,
  ) {
    this.logger.log(
      `[signIn] Iniciando signin para email: ${email}, tenant: ${tenantId}`,
    );

    // Verificar se o tenant existe e obter o ID real
    const tenantExists = await this.prisma.tenant.findFirst({
      where: {
        OR: [{ id: tenantId }, { slug: tenantId }],
      },
    });

    if (!tenantExists) {
      this.logger.warn(`[signIn] Tenant não encontrado: ${tenantId}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`[signIn] Tenant encontrado: ${tenantExists.id}`);

    // Usar o ID real do tenant para a busca do usuário
    const actualTenantId = tenantExists.id;

    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: actualTenantId,
          email,
        },
        deletedAt: null,
        isActive: true,
      },
    });

    if (!user) {
      this.logger.warn(
        `[signIn] Usuário não encontrado: ${email} no tenant: ${actualTenantId}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`[signIn] Usuário encontrado: ${user.id}`);

    const isPasswordValid = await compare(password, user.password);

    this.logger.log(`[signIn] Senha válida: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.warn(`[signIn] Senha inválida para: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar se 2FA está ativo
    if (user.twoFactorEnabled) {
      // Se não forneceu token 2FA, retornar que é necessário
      if (!twoFactorToken) {
        this.logger.log(`[signIn] 2FA necessário para: ${email}`);
        return {
          requiresTwoFactor: true,
          userId: user.id,
          message: 'Código de autenticação de dois fatores necessário',
        };
      }

      // Verificar token 2FA
      const isValid = await this.twoFactorService.verifyTwoFactorToken(
        user.id,
        twoFactorToken,
      );

      if (!isValid) {
        this.logger.warn(`[signIn] Token 2FA inválido para: ${email}`);
        throw new UnauthorizedException('Código de autenticação inválido');
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      tenantSlug: tenantExists.slug,
    };

    const access_token: string = await this.jwt.signAsync(payload);

    this.logger.log(`[signIn] Token gerado com sucesso para: ${email}`);

    return {
      requiresTwoFactor: false,
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getProfileWithPlan(tenantId: string) {
    return this.prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: true,
      },
    });
  }

  async forgotPassword(email: string, tenantId: string) {
    // Verificar se o tenant existe
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        OR: [{ id: tenantId }, { slug: tenantId }],
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant não encontrado');
    }

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email,
        },
      },
    });

    if (!user) {
      // Por segurança, não informar se o email existe ou não
      return {
        message:
          'Se o email existir em nossa base, você receberá instruções para redefinir sua senha.',
      };
    }

    // Invalidar tokens anteriores (marcar como usados)
    await this.prisma.passwordReset.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    // Gerar token único
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

    // Criar registro de reset
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Enviar email
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        token,
        tenant.slug,
      );
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      // Não falhar a requisição se o email não for enviado
    }

    return {
      message:
        'Se o email existir em nossa base, você receberá instruções para redefinir sua senha.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Buscar token válido
    const resetToken = await this.prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Verificar se já foi usado
    if (resetToken.usedAt) {
      throw new BadRequestException('Token já foi utilizado');
    }

    // Verificar se expirou
    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    // Hash da nova senha
    const hashedPassword = await hash(newPassword, 10);

    // Atualizar senha e marcar token como usado
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return {
      message: 'Senha redefinida com sucesso',
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar senha atual
    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedPassword = await hash(newPassword, 10);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: user.tenantId },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      tenantSlug: tenant?.slug,
    };

    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
    };
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      // Buscar usuário
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Upload to Cloudinary usando buffer
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'connecthub/avatars',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else if (result) {
                resolve(result);
              } else {
                reject(new Error('Upload failed'));
              }
            },
          );

          uploadStream.end(file.buffer);
        },
      );

      // Atualizar avatar do usuário no banco de dados
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: result.secure_url },
      });

      return result.secure_url;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Erro ao fazer upload do avatar: ${error.message}`,
      );
    }
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
