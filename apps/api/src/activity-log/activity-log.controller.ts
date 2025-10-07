import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';
import {
  ActivityLogQueryDto,
  ActivityLogListResponseDto,
} from './dto/activity-log.dto';

@ApiTags('Activity Log')
@Controller('activity-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar logs de atividade',
    description:
      'Retorna uma lista paginada de logs de atividade do tenant atual',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs de atividade retornada com sucesso',
    type: ActivityLogListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para acessar logs de atividade',
  })
  @ApiQuery({
    name: 'entity',
    required: false,
    description: 'Filtrar por entidade (ex: Lead, User, Property)',
    example: 'Lead',
  })
  @ApiQuery({
    name: 'entityId',
    required: false,
    description: 'Filtrar por ID específico da entidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (máximo 100)',
    example: 50,
  })
  async getActivityLogs(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: ActivityLogQueryDto,
  ) {
    return this.activityLogService.getActivityLogs(
      user.tenantId,
      query.entity,
      query.entityId,
      query.page,
      query.limit,
    );
  }

  @Get('leads')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar logs de atividade de leads',
    description:
      'Retorna uma lista paginada de logs de atividade específicos de leads',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs de atividade de leads retornada com sucesso',
    type: ActivityLogListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para acessar logs de atividade',
  })
  @ApiQuery({
    name: 'entityId',
    required: false,
    description: 'Filtrar por ID específico do lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (máximo 100)',
    example: 50,
  })
  async getLeadActivityLogs(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: Omit<ActivityLogQueryDto, 'entity'>,
  ) {
    return this.activityLogService.getActivityLogs(
      user.tenantId,
      'Lead',
      query.entityId,
      query.page,
      query.limit,
    );
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar logs de atividade de usuários',
    description:
      'Retorna uma lista paginada de logs de atividade específicos de usuários',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs de atividade de usuários retornada com sucesso',
    type: ActivityLogListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para acessar logs de atividade',
  })
  @ApiQuery({
    name: 'entityId',
    required: false,
    description: 'Filtrar por ID específico do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (máximo 100)',
    example: 50,
  })
  async getUserActivityLogs(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: Omit<ActivityLogQueryDto, 'entity'>,
  ) {
    return this.activityLogService.getActivityLogs(
      user.tenantId,
      'User',
      query.entityId,
      query.page,
      query.limit,
    );
  }

  @Get('properties')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar logs de atividade de propriedades',
    description:
      'Retorna uma lista paginada de logs de atividade específicos de propriedades',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de logs de atividade de propriedades retornada com sucesso',
    type: ActivityLogListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para acessar logs de atividade',
  })
  @ApiQuery({
    name: 'entityId',
    required: false,
    description: 'Filtrar por ID específico da propriedade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (máximo 100)',
    example: 50,
  })
  async getPropertyActivityLogs(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: Omit<ActivityLogQueryDto, 'entity'>,
  ) {
    return this.activityLogService.getActivityLogs(
      user.tenantId,
      'Property',
      query.entityId,
      query.page,
      query.limit,
    );
  }
}
