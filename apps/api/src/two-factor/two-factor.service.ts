import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {
    // Configure OTP settings
    authenticator.options = {
      step: 30, // Token válido por 30 segundos
      window: 1, // Aceita 1 token anterior e 1 posterior
    };
  }

  /**
   * Gera um secret e QR code para ativar 2FA
   */
  async generateTwoFactorSecret(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, twoFactorEnabled: true, name: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA já está ativo para este usuário');
    }

    // Gerar secret
    const secret = authenticator.generateSecret();

    // Criar URI para o QR code
    const otpauth = authenticator.keyuri(user.email, 'ConnectHub', secret);

    // Gerar QR code como Data URL
    const qrCodeDataURL = await toDataURL(otpauth);

    // Salvar secret temporário (ainda não ativo)
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return {
      secret,
      qrCode: qrCodeDataURL,
    };
  }

  /**
   * Ativa 2FA após verificar o token
   */
  async enableTwoFactor(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('Você precisa gerar um secret primeiro');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA já está ativo');
    }

    // Verificar token
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Token inválido');
    }

    // Gerar backup codes
    const backupCodes = this.generateBackupCodes();

    // Ativar 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: backupCodes,
      },
    });

    return {
      success: true,
      backupCodes,
      message: '2FA ativado com sucesso',
    };
  }

  /**
   * Desativa 2FA
   */
  async disableTwoFactor(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA não está ativo');
    }

    // Verificar token antes de desativar
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret!,
    });

    if (!isValid) {
      throw new BadRequestException('Token inválido');
    }

    // Desativar 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: [],
      },
    });

    return {
      success: true,
      message: '2FA desativado com sucesso',
    };
  }

  /**
   * Verifica token 2FA durante signin
   */
  async verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorSecret: true,
        twoFactorEnabled: true,
        twoFactorBackupCodes: true,
      },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    // Verificar se é um backup code
    if (user.twoFactorBackupCodes.includes(token)) {
      // Remover backup code usado
      const updatedCodes = user.twoFactorBackupCodes.filter(
        (code) => code !== token,
      );

      await this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorBackupCodes: updatedCodes },
      });

      return true;
    }

    // Verificar token TOTP
    return authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
  }

  /**
   * Gera códigos de backup
   */
  private generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];

    for (let i = 0; i < count; i++) {
      // Gerar código de 8 caracteres alfanuméricos
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Regenera backup codes
   */
  async regenerateBackupCodes(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('2FA não está ativo');
    }

    // Verificar token
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret!,
    });

    if (!isValid) {
      throw new BadRequestException('Token inválido');
    }

    // Gerar novos backup codes
    const backupCodes = this.generateBackupCodes();

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorBackupCodes: backupCodes },
    });

    return {
      success: true,
      backupCodes,
      message: 'Backup codes regenerados com sucesso',
    };
  }

  /**
   * Verifica se usuário tem 2FA ativo
   */
  async isTwoFactorEnabled(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });

    return user?.twoFactorEnabled || false;
  }
}
