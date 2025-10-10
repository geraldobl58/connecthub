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
import { SignupDto, SignupResponseDto } from './dto/signup.dto';
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
    summary: 'Company signup with plan selection',
    description:
      'Creates a new tenant (company) with admin user, plan subscription, and optional Stripe integration for paid plans',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'Company successfully created',
    type: SignupResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Domain already exists or email already registered',
  })
  @ApiResponse({
    status: 404,
    description: 'Selected plan not found',
  })
  async signup(@Body() body: SignupDto): Promise<SignupResponseDto> {
    return await this.signupService.signup(body);
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
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.email, dto.password, dto.tenantId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs out the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  logout() {
    // In a JWT implementation, we typically don't need to do anything server-side
    // since JWT tokens are stateless. The client will remove the token.
    // However, you could implement token blacklisting here if needed.
    return {
      message: 'Logout successful',
      success: true,
    };
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
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getProfile(@GetCurrentUser() user: CurrentUser) {
    const subscription = await this.service.getProfileWithPlan(user.tenantId);

    return {
      ...user,
      tenant: {
        ...user.tenant,
        plan: subscription?.plan?.name || 'STARTER',
        planExpiresAt: subscription?.expiresAt?.toISOString() || null,
      },
    };
  }
}
