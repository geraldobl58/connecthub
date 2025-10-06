import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StagesService } from './stages.service';
import {
  CreateStageDto,
  UpdateStageDto,
  ReorderStagesDto,
} from './dto/stages.dto';
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
} from '@nestjs/swagger';

@ApiTags('Stages')
@Controller('stages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar stages',
    description: 'Lista todos os stages do tenant ordenados por ordem',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de stages retornada com sucesso',
    schema: {
      example: [
        {
          id: 'stage-id',
          tenantId: 'tenant-id',
          name: 'Novo',
          type: 'SALES',
          order: 1,
          isWon: false,
          isLost: false,
          color: '#3B82F6',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findAll(@GetCurrentUser() user: CurrentUser) {
    return this.stagesService.findAll(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar stage por ID',
    description: 'Busca um stage específico por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Stage encontrado',
    schema: {
      example: {
        id: 'stage-id',
        tenantId: 'tenant-id',
        name: 'Novo',
        type: 'SALES',
        order: 1,
        isWon: false,
        isLost: false,
        color: '#3B82F6',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Stage não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findOne(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.stagesService.findOne(user.tenantId, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo stage',
    description: 'Cria um novo stage no tenant',
  })
  @ApiBody({ type: CreateStageDto })
  @ApiResponse({
    status: 201,
    description: 'Stage criado com sucesso',
    schema: {
      example: {
        id: 'stage-id',
        tenantId: 'tenant-id',
        name: 'Novo Stage',
        type: 'SALES',
        order: 6,
        isWon: false,
        isLost: false,
        color: '#FF5733',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou stage com nome já existe',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createStageDto: CreateStageDto,
  ) {
    return this.stagesService.create(user.tenantId, createStageDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar stage',
    description: 'Atualiza um stage existente',
  })
  @ApiBody({ type: UpdateStageDto })
  @ApiResponse({
    status: 200,
    description: 'Stage atualizado com sucesso',
    schema: {
      example: {
        id: 'stage-id',
        tenantId: 'tenant-id',
        name: 'Stage Atualizado',
        type: 'SALES',
        order: 1,
        isWon: false,
        isLost: false,
        color: '#00FF00',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou stage com nome já existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Stage não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async update(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() updateStageDto: UpdateStageDto,
  ) {
    return this.stagesService.update(user.tenantId, id, updateStageDto);
  }

  @Patch('reorder')
  @ApiOperation({
    summary: 'Reordenar stages',
    description: 'Reordena os stages conforme a lista de IDs fornecida',
  })
  @ApiBody({ type: ReorderStagesDto })
  @ApiResponse({
    status: 200,
    description: 'Stages reordenados com sucesso',
    schema: {
      example: [
        {
          id: 'stage-id-1',
          tenantId: 'tenant-id',
          name: 'Novo',
          type: 'SALES',
          order: 1,
          isWon: false,
          isLost: false,
          color: '#3B82F6',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Alguns stages não foram encontrados ou não pertencem ao tenant',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async reorder(
    @GetCurrentUser() user: CurrentUser,
    @Body() reorderDto: ReorderStagesDto,
  ) {
    return this.stagesService.reorder(user.tenantId, reorderDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir stage',
    description: 'Exclui um stage (não pode ter leads associados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Stage excluído com sucesso',
    schema: {
      example: {
        message: 'Stage deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível excluir stage que tem leads associados',
  })
  @ApiResponse({
    status: 404,
    description: 'Stage não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async remove(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    await this.stagesService.delete(user.tenantId, id);
    return { message: 'Stage deleted successfully' };
  }
}
