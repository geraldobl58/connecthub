import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
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

@ApiTags('Media Upload')
@Controller('media/upload')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @RequireUserCreation()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
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
    summary: 'Upload de imagem',
    description: 'Faz upload de uma imagem para uma propriedade.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem e dados da mídia',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPG, PNG, GIF, WebP)',
        },
        propertyId: {
          type: 'string',
          description: 'ID da propriedade',
          example: 'clh1234567890',
        },
        alt: {
          type: 'string',
          description: 'Texto alternativo da imagem',
          example: 'Sala de estar da propriedade',
        },
        isCover: {
          type: 'boolean',
          description: 'Se é a imagem de capa',
          example: true,
        },
        order: {
          type: 'number',
          description: 'Ordem da mídia',
          example: 1,
        },
      },
      required: ['file', 'propertyId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagem enviada com sucesso',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou dados incorretos',
  })
  @ApiResponse({
    status: 404,
    description: 'Propriedade não encontrada',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }

    const createMediaDto = {
      ...uploadMediaDto,
      url: `/uploads/properties/${file.filename}`,
    };

    return this.mediaService.create(createMediaDto, user.tenantId);
  }

  @Post('temp')
  @RequireUserCreation()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `temp-${uniqueSuffix}${ext}`;
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
    summary: 'Upload de imagem temporária',
    description: 'Faz upload de uma imagem temporária (sem propriedade).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPG, PNG, GIF, WebP)',
        },
        alt: {
          type: 'string',
          description: 'Texto alternativo da imagem',
          example: 'Sala de estar da propriedade',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagem enviada com sucesso',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: '/uploads/properties/temp-1234567890.jpg',
        },
        filename: {
          type: 'string',
          example: 'temp-1234567890.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou dados incorretos',
  })
  async uploadTempFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { alt?: string },
    @GetCurrentUser() user: CurrentUser,
  ): Promise<{ url: string; filename: string; alt?: string }> {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }

    return {
      url: `/uploads/properties/${file.filename}`,
      filename: file.filename,
      alt: body.alt || file.originalname,
    };
  }
}
