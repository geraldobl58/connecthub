import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertyService } from './property.service';
import { MediaService } from '../media/media.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequireUserCreation } from '../common/decorators/permissions.decorator';
import {
  GetCurrentUser,
  CurrentUser,
} from '../common/decorators/current-user-decorator';

@ApiTags('Property Upload')
@Controller('properties/:propertyId/media')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PropertyUploadController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly mediaService: MediaService,
  ) {}

  @Post('upload')
  @RequireUserCreation()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `property-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Apenas imagens são permitidas!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiOperation({
    summary: 'Upload de imagens para propriedade',
    description:
      'Faz upload de múltiplas imagens para uma propriedade específica.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivos de imagem',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Arquivos de imagem (JPG, PNG, GIF, WebP)',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagens enviadas com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou dados incorretos',
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  async uploadFiles(
    @Param('propertyId') propertyId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @GetCurrentUser() user: CurrentUser,
  ) {
    if (!files || files.length === 0) {
      throw new Error('Pelo menos um arquivo é obrigatório');
    }

    // Verificar se a propriedade existe e pertence ao tenant
    await this.propertyService.findOne(propertyId, user.tenantId);

    const mediaResults: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const createMediaDto = {
        propertyId,
        url: `/uploads/properties/${file.filename}`,
        alt: file.originalname,
        isCover: i === 0, // Primeira imagem é capa
        order: i,
      };

      const media = await this.mediaService.create(
        createMediaDto,
        user.tenantId,
      );
      mediaResults.push(media);
    }

    return {
      message: `${files.length} imagem(ns) enviada(s) com sucesso`,
      media: mediaResults,
    };
  }
}
