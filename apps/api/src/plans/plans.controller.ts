import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanUpgradeDto } from './dto/plan-upgrade.dto';
import { PlanRenewalDto } from './dto/plan-renewal.dto';
import {
  PlanInfoDto,
  PlanUpgradeResponseDto,
  PlanRenewalResponseDto,
  PlanCancelResponseDto,
} from './dto/plan-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';

@ApiTags('Plans')
@Controller('plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get('available')
  @ApiOperation({
    summary: 'Get all available plans',
    description: 'Returns all available subscription plans for signup',
  })
  @ApiResponse({
    status: 200,
    description: 'Available plans retrieved successfully',
  })
  async getAvailablePlans() {
    return await this.plansService.getAllPlans();
  }

  @Get('current')
  @ApiOperation({
    summary: 'Get current plan',
    description:
      'Returns the current plan information for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Current plan retrieved successfully',
    type: PlanInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Plano não encontrado para este tenant',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getCurrentPlan(@GetCurrentUser() user: CurrentUser): Promise<PlanInfoDto> {
    return this.plansService.getCurrentPlan(user.tenantId);
  }

  @Post('upgrade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Upgrade plan',
    description: 'Upgrades the current plan to a higher tier',
  })
  @ApiBody({ type: PlanUpgradeDto })
  @ApiResponse({
    status: 200,
    description: 'Plan upgraded successfully',
    type: PlanUpgradeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid upgrade request',
    schema: {
      example: {
        statusCode: 400,
        message: 'O novo plano deve ser superior ao plano atual',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Plano não encontrado',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  upgradePlan(
    @GetCurrentUser() user: CurrentUser,
    @Body() dto: PlanUpgradeDto,
  ): Promise<PlanUpgradeResponseDto> {
    return this.plansService.upgradePlan(user.tenantId, dto);
  }

  @Post('renew')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renew plan',
    description: 'Renews the current plan for another billing period',
  })
  @ApiBody({ type: PlanRenewalDto })
  @ApiResponse({
    status: 200,
    description: 'Plan renewed successfully',
    type: PlanRenewalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Assinatura não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  renewPlan(
    @GetCurrentUser() user: CurrentUser,
    @Body() dto: PlanRenewalDto,
  ): Promise<PlanRenewalResponseDto> {
    return this.plansService.renewPlan(user.tenantId, dto);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel plan',
    description: 'Cancels the current plan subscription',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan canceled successfully',
    type: PlanCancelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Plan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Assinatura não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  cancelPlan(
    @GetCurrentUser() user: CurrentUser,
  ): Promise<PlanCancelResponseDto> {
    return this.plansService.cancelPlan(user.tenantId);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get plan history',
    description: 'Returns the plan history for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan history retrieved successfully',
    type: [PlanInfoDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getPlanHistory(@GetCurrentUser() user: CurrentUser): Promise<PlanInfoDto[]> {
    return this.plansService.getPlanHistory(user.tenantId);
  }

  @Get('available')
  @ApiOperation({
    summary: 'Get all available plans',
    description: 'Returns all available plans for subscription',
  })
  @ApiResponse({
    status: 200,
    description: 'Available plans retrieved successfully',
  })
  // Método removido - duplicado

  @Post('checkout-session')
  @ApiOperation({
    summary: 'Create checkout session',
    description: 'Creates a Stripe checkout session for plan subscription',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        priceId: { type: 'string', description: 'Stripe price ID' },
        successUrl: { type: 'string', description: 'Success redirect URL' },
        cancelUrl: { type: 'string', description: 'Cancel redirect URL' },
      },
      required: ['priceId', 'successUrl', 'cancelUrl'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created successfully',
  })
  async createCheckoutSession(
    @Body() dto: { priceId: string; successUrl: string; cancelUrl: string },
    @GetCurrentUser() user: CurrentUser,
  ) {
    const sessionUrl = await this.plansService.createCheckoutSession(
      user.tenantId,
      dto.priceId,
      dto.successUrl,
      dto.cancelUrl,
    );
    return { url: sessionUrl };
  }

  @Post('billing-portal')
  @ApiOperation({
    summary: 'Create billing portal session',
    description: 'Creates a Stripe billing portal session for subscription management',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        returnUrl: { type: 'string', description: 'Return URL after billing management' },
      },
      required: ['returnUrl'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Billing portal session created successfully',
  })
  async createBillingPortalSession(
    @Body() dto: { returnUrl: string },
    @GetCurrentUser() user: CurrentUser,
  ) {
    const portalUrl = await this.plansService.createBillingPortalSession(
      user.tenantId,
      dto.returnUrl,
    );
    return { url: portalUrl };
  }

  @Get('usage-limits')
  @ApiOperation({
    summary: 'Get usage limits',
    description: 'Returns current usage and limits for the tenant',
  })
  @ApiResponse({
    status: 200,
    description: 'Usage limits retrieved successfully',
  })
  async getUsageLimits(@GetCurrentUser() user: CurrentUser) {
    return this.plansService.checkUsageLimits(user.tenantId);
  }

  @Get('subscription/validate')
  @ApiOperation({
    summary: 'Validate subscription',
    description: 'Validates if the current subscription is active and valid',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription validation result',
  })
  async validateSubscription(@GetCurrentUser() user: CurrentUser) {
    const isValid = await this.plansService.validateSubscription(user.tenantId);
    return { isValid };
  }
}
