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
import { UsageLimitGuard, UsageLimit } from '../common/guards/usage-limit.guard';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';
import { PropertiesService } from './properties.service';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyListQueryDto,
} from './dto/properties.dto';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(UsageLimitGuard)
  @UsageLimit({ resource: 'properties', action: 'create' })
  @ApiOperation({ summary: 'Criar uma nova propriedade' })
  @ApiResponse({
    status: 201,
    description: 'Propriedade criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou propriedade já existe',
  })
  @ApiResponse({
    status: 403,
    description: 'Limite de propriedades atingido',
  })
  create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(user.tenantId, createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar propriedades do tenant' })
  @ApiResponse({
    status: 200,
    description: 'Lista de propriedades retornada com sucesso',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Termo de busca por código, título ou descrição',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['HOUSE', 'APARTMENT', 'CONDO', 'LAND', 'COMMERCIAL'],
    description: 'Filtrar por tipo de propriedade',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'INACTIVE', 'RESERVED', 'SOLD', 'RENTED'],
    description: 'Filtrar por status da propriedade',
  })
  @ApiQuery({
    name: 'ownerId',
    required: false,
    type: String,
    description: 'Filtrar por proprietário',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Preço mínimo',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Preço máximo',
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
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('ownerId') ownerId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const query: PropertyListQueryDto = {
      search,
      type: type as any,
      status: status as any,
      ownerId,
      minPrice,
      maxPrice,
      page,
      limit,
    };
    return this.propertiesService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar propriedade por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da propriedade',
  })
  @ApiResponse({
    status: 200,
    description: 'Propriedade encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  findOne(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.propertiesService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar propriedade' })
  @ApiParam({
    name: 'id',
    description: 'ID da propriedade',
  })
  @ApiResponse({
    status: 200,
    description: 'Propriedade atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou propriedade já existe',
  })
  update(
    @GetCurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(user.tenantId, id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar propriedade' })
  @ApiParam({
    name: 'id',
    description: 'ID da propriedade',
  })
  @ApiResponse({
    status: 200,
    description: 'Propriedade deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar propriedade com registros associados',
  })
  remove(@GetCurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.propertiesService.remove(user.tenantId, id);
  }
}
