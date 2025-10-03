import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
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

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @RequireUserCreation()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar mídia',
    description: 'Cria uma nova mídia para uma propriedade.',
  })
  @ApiBody({
    type: CreateMediaDto,
    description: 'Dados da mídia a ser criada',
  })
  @ApiResponse({
    status: 201,
    description: 'Mídia criada com sucesso',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<MediaResponseDto> {
    return this.mediaService.create(createMediaDto, user.tenantId);
  }

  @Get('property/:propertyId')
  @RequireUserRead()
  @ApiOperation({
    summary: 'Listar mídias de uma propriedade',
    description: 'Lista todas as mídias de uma propriedade específica.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mídias retornada com sucesso',
    type: [MediaResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  async findAllByProperty(
    @Param('propertyId') propertyId: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<MediaResponseDto[]> {
    return this.mediaService.findAllByProperty(propertyId, user.tenantId);
  }

  @Get(':id')
  @RequireUserRead()
  @ApiOperation({
    summary: 'Buscar mídia por ID',
    description: 'Retorna uma mídia específica pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mídia encontrada',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Mídia não encontrada',
  })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<MediaResponseDto> {
    return this.mediaService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @RequireUserManagement()
  @ApiOperation({
    summary: 'Atualizar mídia',
    description: 'Atualiza os dados de uma mídia.',
  })
  @ApiBody({
    type: UpdateMediaDto,
    description: 'Dados a serem atualizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Mídia atualizada com sucesso',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Mídia não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<MediaResponseDto> {
    return this.mediaService.update(id, updateMediaDto, user.tenantId);
  }

  @Delete(':id')
  @RequireUserManagement()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir mídia',
    description: 'Exclui uma mídia.',
  })
  @ApiResponse({
    status: 204,
    description: 'Mídia excluída com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Mídia não encontrada',
  })
  async remove(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<void> {
    return this.mediaService.remove(id, user.tenantId);
  }

  @Patch('reorder/:propertyId')
  @RequireUserManagement()
  @ApiOperation({
    summary: 'Reordenar mídias',
    description: 'Reordena as mídias de uma propriedade.',
  })
  @ApiBody({
    description: 'Array com os IDs das mídias na nova ordem',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: ['media1', 'media2', 'media3'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mídias reordenadas com sucesso',
    type: [MediaResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  async reorder(
    @Param('propertyId') propertyId: string,
    @Body() mediaIds: string[],
    @GetCurrentUser() user: CurrentUser,
  ): Promise<MediaResponseDto[]> {
    return this.mediaService.reorder(propertyId, mediaIds, user.tenantId);
  }
}
