import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string, tenantId?: string) {
    // Primeiro, verificar se o tenant existe quando informado e obter o ID real
    let actualTenantId = tenantId;
    if (tenantId) {
      const tenantExists = await this.prisma.tenant.findFirst({
        where: {
          OR: [{ id: tenantId }, { slug: tenantId }],
        },
      });

      if (!tenantExists) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Usar o ID real do tenant para a busca do usuário
      actualTenantId = tenantExists.id;
    }

    const user = actualTenantId
      ? await this.prisma.user.findUnique({
          where: {
            tenantId_email: {
              tenantId: actualTenantId,
              email,
            },
            deletedAt: null,
            isActive: true,
          },
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        })
      : await this.prisma.user.findFirst({
          where: {
            email,
            deletedAt: null,
            isActive: true,
          },
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      tenantId: user.tenantId,
      tenantSlug: user.tenant.slug,
    };

    const access_token: string = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
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
}
