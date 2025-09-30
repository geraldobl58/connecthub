import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupService } from './signup.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import {
  CurrentUser,
  GetCurrentUser,
} from 'src/common/decorators/current-user-decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private signupService: SignupService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Company signup',
    description:
      'Creates a new tenant (company) with admin user and sends welcome email',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'Company successfully created',
    schema: {
      example: {
        success: true,
        message:
          'Cadastro realizado com sucesso! Verifique seu email para acessar a plataforma.',
        tenant: {
          id: 'tenant-uuid',
          name: 'Tech Solutions Corp',
          slug: 'tech-solutions',
          plan: 'PROFESSIONAL',
        },
        user: {
          id: 'user-uuid',
          name: 'João Silva',
          email: 'admin@tech-solutions.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Domain or email already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Este subdomínio já está em uso',
        error: 'Conflict',
      },
    },
  })
  signup(@Body() dto: SignupDto) {
    return this.signupService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user and returns JWT access token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'jwt_token_string',
        user: {
          id: 'uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'AGENT',
          tenant: {
            id: 'tenant-uuid',
            name: 'My Company',
            slug: 'my-company',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.email, dto.password, dto.tenantId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile information of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        userId: 'uuid',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'AGENT',
        tenantId: 'tenant-uuid',
        tenant: {
          id: 'tenant-uuid',
          name: 'My Company',
          slug: 'my-company',
          plan: 'PROFESSIONAL',
          planExpiresAt: '2024-02-15T10:30:00Z',
          createdAt: '2024-01-15T10:30:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getProfile(@GetCurrentUser() user: CurrentUser) {
    // Buscar dados do plano
    const subscription = await this.service.getProfileWithPlan(user.tenantId);

    return {
      ...user,
      tenant: {
        ...user.tenant,
        plan: subscription?.plan?.name || 'STARTER',
        planExpiresAt:
          subscription?.expiresAt?.toISOString() ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt:
          subscription?.startedAt?.toISOString() || new Date().toISOString(),
      },
    };
  }
}
