import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { OwnerQueryDto } from './dto/owner-query.dto';
import {
  OwnerResponseDto,
  PaginatedOwnersResponseDto,
} from './dto/owner-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  RequireUserCreation,
  RequireUserRead,
  RequireUserManagement,
} from '../common/decorators/permissions.decorator';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';

@ApiTags('Owners')
@Controller('owners')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @RequireUserCreation()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar proprietário',
    description: 'Cria um novo proprietário no tenant do usuário.',
  })
  @ApiBody({
    type: CreateOwnerDto,
    description: 'Dados do proprietário a ser criado',
  })
  @ApiResponse({
    status: 201,
    description: 'Proprietário criado com sucesso',
    type: OwnerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já existe para outro proprietário',
  })
  async create(
    @Body() createOwnerDto: CreateOwnerDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<OwnerResponseDto> {
    return this.ownersService.create(createOwnerDto, user.tenantId);
  }

  @Get()
  @RequireUserRead()
  @ApiOperation({
    summary: 'Listar proprietários',
    description: 'Lista proprietários do tenant com filtros e paginação.',
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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por nome, email ou telefone',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Campo para ordenação (padrão: name)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Direção da ordenação (padrão: asc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de proprietários retornada com sucesso',
    type: PaginatedOwnersResponseDto,
  })
  async findAll(
    @Query() query: OwnerQueryDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<PaginatedOwnersResponseDto> {
    return this.ownersService.findAll(query, user.tenantId);
  }

  @Get(':id')
  @RequireUserRead()
  @ApiOperation({
    summary: 'Buscar proprietário por ID',
    description: 'Retorna um proprietário específico pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Proprietário encontrado',
    type: OwnerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Proprietário não encontrado',
  })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<OwnerResponseDto> {
    return this.ownersService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @RequireUserManagement()
  @ApiOperation({
    summary: 'Atualizar proprietário',
    description: 'Atualiza os dados de um proprietário.',
  })
  @ApiBody({
    type: UpdateOwnerDto,
    description: 'Dados a serem atualizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Proprietário atualizado com sucesso',
    type: OwnerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Proprietário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já existe para outro proprietário',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<OwnerResponseDto> {
    return this.ownersService.update(id, updateOwnerDto, user.tenantId);
  }

  @Delete(':id')
  @RequireUserManagement()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir proprietário',
    description: 'Exclui um proprietário (apenas se não tiver propriedades).',
  })
  @ApiResponse({
    status: 204,
    description: 'Proprietário excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Proprietário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Proprietário possui propriedades e não pode ser excluído',
  })
  async remove(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<void> {
    return this.ownersService.remove(id, user.tenantId);
  }
}
