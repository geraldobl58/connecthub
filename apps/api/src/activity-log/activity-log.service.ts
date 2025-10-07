import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async logActivity(
    tenantId: string,
    actorId: string | null,
    entity: string,
    entityId: string,
    action: string,
    metadata?: any,
  ): Promise<void> {
    await this.prisma.activityLog.create({
      data: {
        tenantId,
        actorId,
        entity,
        entityId,
        action,
        metadata,
      },
    });
  }

  async getActivityLogs(
    tenantId: string,
    entity?: string,
    entityId?: string,
    page = 1,
    limit = 50,
  ) {
    const where: any = { tenantId };

    if (entity) {
      where.entity = entity;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
