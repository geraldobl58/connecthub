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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import {
  UserResponseDto,
  PaginatedUsersResponseDto,
} from './dto/user-response.dto';
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
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequireUserCreation()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo usuário no tenant. Apenas ADMIN pode criar usuários.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para criar usuários',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto, user.tenantId, user.role);
  }

  @Get()
  @RequireUserRead()
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista usuários do tenant com filtros e paginação.',
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
    description: 'Buscar por nome ou email',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    description: 'Filtrar por role',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por status ativo',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Campo para ordenação (padrão: createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Direção da ordenação (padrão: desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: PaginatedUsersResponseDto,
  })
  async findAll(
    @Query() query: UserQueryDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(query, user.tenantId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Buscar perfil do usuário atual',
    description: 'Retorna as informações do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado',
  })
  async getProfile(
    @GetCurrentUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.findOne(user.userId, user.tenantId);
  }

  @Get(':id')
  @RequireUserRead()
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Busca um usuário específico por ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @RequireUserManagement()
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Atualiza um usuário existente. ADMIN e MANAGER podem editar usuários.',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para editar usuários',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    return this.usersService.update(
      id,
      updateUserDto,
      user.tenantId,
      user.role,
    );
  }

  @Delete(':id')
  @RequireUserCreation()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir usuário',
    description:
      'Exclui um usuário (soft delete). Apenas ADMIN pode excluir usuários.',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para excluir usuários',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async remove(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<void> {
    return this.usersService.remove(id, user.tenantId, user.role);
  }
}
