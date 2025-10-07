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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';
import { OwnersService } from './owners.service';
import {
  CreateOwnerDto,
  UpdateOwnerDto,
  OwnerListQueryDto,
} from './dto/owners.dto';

@ApiTags('Owners')
@Controller('owners')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo proprietário' })
  @ApiResponse({
    status: 201,
    description: 'Proprietário criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou proprietário já existe',
  })
  create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createOwnerDto: CreateOwnerDto,
  ) {
    return this.ownersService.create(user.tenantId, createOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar proprietários do tenant' })
  @ApiResponse({
    status: 200,
    description: 'Lista de proprietários retornada com sucesso',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca por nome, email ou telefone',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de itens por página (padrão: 20)',
  })
  findAll(
    @GetCurrentUser() user: CurrentUser,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const query: OwnerListQueryDto = {
      search,
      page,
      limit,
    };
    return this.ownersService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar proprietário por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do proprietário',
  })
  @ApiResponse({
    status: 200,
    description: 'Proprietário encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Proprietário não encontrado',
  })
  findOne(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.ownersService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar proprietário' })
  @ApiParam({
    name: 'id',
    description: 'ID do proprietário',
  })
  @ApiResponse({
    status: 200,
    description: 'Proprietário atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Proprietário não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou proprietário já existe',
  })
  update(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ) {
    return this.ownersService.update(user.tenantId, id, updateOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar proprietário' })
  @ApiParam({
    name: 'id',
    description: 'ID do proprietário',
  })
  @ApiResponse({
    status: 200,
    description: 'Proprietário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Proprietário não encontrado',
  })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível deletar proprietário com propriedades associadas',
  })
  remove(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.ownersService.remove(user.tenantId, id);
  }
}
