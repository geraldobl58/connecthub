import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(
    createMediaDto: CreateMediaDto,
    tenantId: string,
  ): Promise<MediaResponseDto> {
    // Verificar se a propriedade existe e pertence ao tenant
    const property = await this.prisma.property.findFirst({
      where: {
        id: createMediaDto.propertyId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada neste tenant');
    }

    // Se esta mídia for marcada como capa, desmarcar outras mídias da mesma propriedade
    if (createMediaDto.isCover) {
      await this.prisma.media.updateMany({
        where: {
          propertyId: createMediaDto.propertyId,
        },
        data: {
          isCover: false,
        },
      });
    }

    // Se não foi especificada uma ordem, usar a próxima disponível
    let order = createMediaDto.order || 0;
    if (!createMediaDto.order) {
      const lastMedia = await this.prisma.media.findFirst({
        where: {
          propertyId: createMediaDto.propertyId,
        },
        orderBy: {
          order: 'desc',
        },
      });
      order = lastMedia ? lastMedia.order + 1 : 0;
    }

    const media = await this.prisma.media.create({
      data: {
        ...createMediaDto,
        order,
      },
    });

    return new MediaResponseDto(media);
  }

  async findAllByProperty(
    propertyId: string,
    tenantId: string,
  ): Promise<MediaResponseDto[]> {
    // Verificar se a propriedade existe e pertence ao tenant
    const property = await this.prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada neste tenant');
    }

    const mediaList = await this.prisma.media.findMany({
      where: {
        propertyId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return mediaList.map((media) => new MediaResponseDto(media));
  }

  async findOne(id: string, tenantId: string): Promise<MediaResponseDto> {
    const media = await this.prisma.media.findFirst({
      where: {
        id,
        property: {
          tenantId,
          deletedAt: null,
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Mídia não encontrada neste tenant');
    }

    return new MediaResponseDto(media);
  }

  async update(
    id: string,
    updateMediaDto: UpdateMediaDto,
    tenantId: string,
  ): Promise<MediaResponseDto> {
    // Verificar se a mídia existe e pertence ao tenant
    const existingMedia = await this.prisma.media.findFirst({
      where: {
        id,
        property: {
          tenantId,
          deletedAt: null,
        },
      },
    });

    if (!existingMedia) {
      throw new NotFoundException('Mídia não encontrada neste tenant');
    }

    // Se esta mídia for marcada como capa, desmarcar outras mídias da mesma propriedade
    if (updateMediaDto.isCover) {
      await this.prisma.media.updateMany({
        where: {
          propertyId: existingMedia.propertyId,
          id: { not: id },
        },
        data: {
          isCover: false,
        },
      });
    }

    const media = await this.prisma.media.update({
      where: { id },
      data: updateMediaDto,
    });

    return new MediaResponseDto(media);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    // Verificar se a mídia existe e pertence ao tenant
    const media = await this.prisma.media.findFirst({
      where: {
        id,
        property: {
          tenantId,
          deletedAt: null,
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Mídia não encontrada neste tenant');
    }

    await this.prisma.media.delete({
      where: { id },
    });
  }

  async reorder(
    propertyId: string,
    mediaIds: string[],
    tenantId: string,
  ): Promise<MediaResponseDto[]> {
    // Verificar se a propriedade existe e pertence ao tenant
    const property = await this.prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!property) {
      throw new NotFoundException('Propriedade não encontrada neste tenant');
    }

    // Atualizar a ordem das mídias
    const updatePromises = mediaIds.map((mediaId, index) =>
      this.prisma.media.updateMany({
        where: {
          id: mediaId,
          propertyId,
        },
        data: {
          order: index,
        },
      }),
    );

    await Promise.all(updatePromises);

    // Retornar as mídias na nova ordem
    return this.findAllByProperty(propertyId, tenantId);
  }
}
