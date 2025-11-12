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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import {
  CreateContractDto,
  UpdateContractDto,
  ContractResponseDto,
  PaginatedContractResponseDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo contrato' })
  @ApiResponse({
    status: 201,
    description: 'Contrato criado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Identificador do contrato já existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  create(@Request() req: any, @Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(req.user.tenantId, createContractDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contratos com filtro e paginação' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de registros por página (padrão: 20, máximo: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Filtrar por título, identificador, conteúdo ou nome do cliente',
    example: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contratos retornada com sucesso',
    type: PaginatedContractResponseDto,
  })
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.contractsService.findAll(
      req.user.tenantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um contrato' })
  @ApiResponse({
    status: 200,
    description: 'Contrato encontrado',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contrato não encontrado',
  })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.contractsService.findOne(req.user.tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um contrato' })
  @ApiResponse({
    status: 200,
    description: 'Contrato atualizado com sucesso',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contrato ou cliente não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Identificador já existe',
  })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(
      req.user.tenantId,
      id,
      updateContractDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um contrato' })
  @ApiResponse({
    status: 200,
    description: 'Contrato deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Contrato não encontrado',
  })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.contractsService.remove(req.user.tenantId, id);
  }
}
