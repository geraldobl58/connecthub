import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import {
  CreateLeadDto,
  UpdateLeadDto,
  MoveLeadDto,
  LeadListQueryDto,
} from './dto/leads.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar leads',
    description: 'Lista leads do tenant com paginação e filtros',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por nome, telefone ou email',
  })
  @ApiQuery({
    name: 'stageId',
    required: false,
    type: String,
    description: 'Filtrar por stage',
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    type: String,
    description: 'Filtrar por agente atribuído',
  })
  @ApiQuery({
    name: 'source',
    required: false,
    enum: ['WEB', 'PHONE', 'REFERRAL', 'SOCIAL', 'OTHER'],
    description: 'Filtrar por fonte',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: 'Buscar por telefone',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Buscar por email',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Filtrar por tags (separadas por vírgula)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de leads retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: 'lead-id',
            tenantId: 'tenant-id',
            name: 'João Silva',
            phone: '11999999999',
            email: 'joao@email.com',
            source: 'WEB',
            stageId: 'stage-id',
            stage: {
              id: 'stage-id',
              name: 'Novo',
              color: '#3B82F6',
            },
            assignedTo: 'agent-id',
            agent: {
              id: 'agent-id',
              name: 'Maria Santos',
              email: 'maria@email.com',
            },
            notesText: 'Cliente interessado em apartamento',
            propertyId: 'property-id',
            property: {
              id: 'property-id',
              title: 'Apartamento 2 quartos',
              address: 'Rua das Flores, 123',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            leadTags: [],
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 5,
          totalPages: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findAll(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: LeadListQueryDto,
  ) {
    return this.leadsService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar lead por ID',
    description: 'Busca um lead específico por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Lead encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findOne(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.leadsService.findOne(user.tenantId, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo lead',
    description: 'Cria um novo lead no tenant com normalização de telefone',
  })
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({
    status: 201,
    description: 'Lead criado com sucesso',
    schema: {
      example: {
        id: 'lead-id',
        tenantId: 'tenant-id',
        name: 'João Silva',
        phone: '11999999999',
        email: 'joao@email.com',
        source: 'WEB',
        stageId: 'stage-id',
        assignedTo: null,
        notesText: 'Cliente interessado em apartamento',
        propertyId: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou lead com telefone/email já existe',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createLeadDto: CreateLeadDto,
  ) {
    return this.leadsService.create(user.tenantId, createLeadDto, user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar lead',
    description: 'Atualiza um lead existente',
  })
  @ApiBody({ type: UpdateLeadDto })
  @ApiResponse({
    status: 200,
    description: 'Lead atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async update(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(
      user.tenantId,
      id,
      updateLeadDto,
      user.userId,
    );
  }

  @Post(':id/move')
  @ApiOperation({
    summary: 'Mover lead para outro stage',
    description: 'Move um lead para um stage diferente e registra a atividade',
  })
  @ApiBody({ type: MoveLeadDto })
  @ApiResponse({
    status: 200,
    description: 'Lead movido com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Stage não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async move(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() moveLeadDto: MoveLeadDto,
  ) {
    return this.leadsService.move(user.tenantId, id, moveLeadDto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar lead',
    description: 'Remove um lead (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lead deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async delete(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.leadsService.delete(user.tenantId, id, user.userId);
  }

  @Patch(':id/assign')
  @ApiOperation({
    summary: 'Atribuir lead a agente',
    description: 'Atribui um lead a um agente específico',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          description: 'ID do agente',
        },
      },
      required: ['agentId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Lead atribuído com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Agente não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async assignToAgent(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body('agentId') agentId: string,
  ) {
    return this.leadsService.assignToAgent(
      user.tenantId,
      id,
      agentId,
      user.userId,
    );
  }

  @Patch(':id/unassign')
  @ApiOperation({
    summary: 'Remover atribuição de lead',
    description: 'Remove a atribuição de um lead de qualquer agente',
  })
  @ApiResponse({
    status: 200,
    description: 'Atribuição removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async unassignFromAgent(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
  ) {
    return this.leadsService.unassignFromAgent(user.tenantId, id, user.userId);
  }
}
