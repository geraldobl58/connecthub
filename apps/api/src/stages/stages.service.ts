import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateStageDto,
  UpdateStageDto,
  ReorderStagesDto,
} from './dto/stages.dto';
import { Stage, StageType } from '@prisma/client';

@Injectable()
export class StagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<Stage[]> {
    return this.prisma.stage.findMany({
      where: { tenantId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Stage> {
    const stage = await this.prisma.stage.findFirst({
      where: { id, tenantId },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    return stage;
  }

  async create(
    tenantId: string,
    createStageDto: CreateStageDto,
  ): Promise<Stage> {
    const { name, type = StageType.SALES, color } = createStageDto;

    // Verificar se já existe um stage com o mesmo nome no tenant
    const existingStage = await this.prisma.stage.findFirst({
      where: { tenantId, name },
    });

    if (existingStage) {
      throw new BadRequestException('Stage with this name already exists');
    }

    // Obter o próximo order
    const lastStage = await this.prisma.stage.findFirst({
      where: { tenantId },
      orderBy: { order: 'desc' },
    });

    const order = lastStage ? lastStage.order + 1 : 1;

    return this.prisma.stage.create({
      data: {
        tenantId,
        name,
        type,
        order,
        color,
      },
    });
  }

  async update(
    tenantId: string,
    id: string,
    updateStageDto: UpdateStageDto,
  ): Promise<Stage> {
    const stage = await this.findOne(tenantId, id);

    const { name, type, color, isWon, isLost } = updateStageDto;

    // Se está mudando o nome, verificar se já existe outro stage com o mesmo nome
    if (name && name !== stage.name) {
      const existingStage = await this.prisma.stage.findFirst({
        where: { tenantId, name, id: { not: id } },
      });

      if (existingStage) {
        throw new BadRequestException('Stage with this name already exists');
      }
    }

    return this.prisma.stage.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(color !== undefined && { color }),
        ...(isWon !== undefined && { isWon }),
        ...(isLost !== undefined && { isLost }),
      },
    });
  }

  async reorder(
    tenantId: string,
    reorderDto: ReorderStagesDto,
  ): Promise<Stage[]> {
    const { stageIds } = reorderDto;

    // Verificar se todos os stages pertencem ao tenant
    const stages = await this.prisma.stage.findMany({
      where: {
        id: { in: stageIds },
        tenantId,
      },
    });

    if (stages.length !== stageIds.length) {
      throw new BadRequestException(
        'Some stages not found or do not belong to tenant',
      );
    }

    // Atualizar a ordem dos stages
    const updatePromises = stageIds.map((stageId, index) =>
      this.prisma.stage.update({
        where: { id: stageId },
        data: { order: index + 1 },
      }),
    );

    await Promise.all(updatePromises);

    // Retornar os stages reordenados
    return this.findAll(tenantId);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.findOne(tenantId, id);

    // Verificar se há leads usando este stage
    const leadsCount = await this.prisma.lead.count({
      where: { stageId: id },
    });

    if (leadsCount > 0) {
      throw new BadRequestException(
        'Cannot delete stage that has leads assigned to it',
      );
    }

    await this.prisma.stage.delete({
      where: { id },
    });

    // Reordenar os stages restantes
    await this.reorderRemainingStages(tenantId);
  }

  private async reorderRemainingStages(tenantId: string): Promise<void> {
    const stages = await this.prisma.stage.findMany({
      where: { tenantId },
      orderBy: { order: 'asc' },
    });

    const updatePromises = stages.map((stage, index) =>
      this.prisma.stage.update({
        where: { id: stage.id },
        data: { order: index + 1 },
      }),
    );

    await Promise.all(updatePromises);
  }

  async createDefaultStages(tenantId: string): Promise<Stage[]> {
    const defaultStages = [
      { name: 'Novo', type: StageType.SALES, order: 1, color: '#3B82F6' },
      {
        name: 'Qualificado',
        type: StageType.SALES,
        order: 2,
        color: '#10B981',
      },
      { name: 'Proposta', type: StageType.SALES, order: 3, color: '#F59E0B' },
      {
        name: 'Fechado (Won)',
        type: StageType.SALES,
        order: 4,
        color: '#059669',
        isWon: true,
      },
      {
        name: 'Fechado (Lost)',
        type: StageType.SALES,
        order: 5,
        color: '#DC2626',
        isLost: true,
      },
    ];

    const createdStages = await Promise.all(
      defaultStages.map((stage) =>
        this.prisma.stage.create({
          data: {
            tenantId,
            ...stage,
          },
        }),
      ),
    );

    return createdStages;
  }
}
