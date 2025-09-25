import { JwtService } from '@nestjs/jwt';
import { Role, User, Tenant } from '@prisma/client';
import { compare, hash } from 'bcrypt';

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar se o tenant existe
    const tenant: Tenant | null = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new ConflictException('Tenant not found');
    }

    // Verificar se o email já existe dentro do tenant
    const exists: User | null = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: dto.tenantId,
          email: dto.email,
        },
      },
    });

    if (exists) {
      throw new ConflictException('Email already in use in this tenant');
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? Role.AGENT,
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

    return user;
  }

  async login(email: string, password: string, tenantId?: string) {
    const user = tenantId
      ? await this.prisma.user.findUnique({
          where: {
            tenantId_email: {
              tenantId,
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
}
