import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  CreateLeadDto,
  UpdateLeadDto,
  MoveLeadDto,
  LeadListQueryDto,
} from './dto/leads.dto';
import { Lead, LeadSource } from '@prisma/client';
import {
  normalizePhone,
  normalizeEmail,
  isValidPhone,
  isValidEmail,
} from './utils/lead.utils';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  async findAll(
    tenantId: string,
    query?: LeadListQueryDto,
  ): Promise<{ data: Lead[]; meta: any }> {
    const {
      search,
      stageId,
      assignedTo,
      source,
      phone,
      email,
      tags,
      page = 1,
      limit = 10,
    } = query || {};

    // Construir filtros
    const where: any = {
      tenantId,
      deletedAt: null, // Apenas leads não deletados
    };

    // Busca geral (nome, telefone, email)
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Filtros específicos
    if (stageId) {
      where.stageId = stageId;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (source) {
      where.source = source;
    }

    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      where.phone = normalizedPhone;
    }

    if (email) {
      const normalizedEmail = normalizeEmail(email);
      where.email = normalizedEmail;
    }

    if (tags && tags.length > 0) {
      where.leadTags = {
        some: {
          tagId: {
            in: tags,
          },
        },
      };
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Buscar leads com filtros e paginação
    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          stage: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              address: true,
            },
          },
          leadTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: leads,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const lead = await this.prisma.lead.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        leadTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async create(
    tenantId: string,
    createLeadDto: CreateLeadDto,
    actorId?: string,
  ): Promise<Lead> {
    const {
      name,
      phone,
      email,
      source = LeadSource.WEB,
      stageId,
      assignedTo,
      notesText,
      propertyId,
      tags,
    } = createLeadDto;

    // Validar telefone se fornecido
    if (phone && !isValidPhone(phone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Validar email se fornecido
    if (email && !isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Verificar se já existe lead com mesmo telefone no tenant
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      const existingLead = await this.prisma.lead.findFirst({
        where: {
          tenantId,
          phone: normalizedPhone,
          deletedAt: null,
        },
      });

      if (existingLead) {
        throw new BadRequestException(
          'Lead with this phone number already exists',
        );
      }
    }

    // Verificar se já existe lead com mesmo email no tenant
    if (email) {
      const normalizedEmail = normalizeEmail(email);
      const existingLead = await this.prisma.lead.findFirst({
        where: {
          tenantId,
          email: normalizedEmail,
          deletedAt: null,
        },
      });

      if (existingLead) {
        throw new BadRequestException('Lead with this email already exists');
      }
    }

    // Verificar se stage existe e pertence ao tenant
    if (stageId) {
      const stage = await this.prisma.stage.findFirst({
        where: { id: stageId, tenantId },
      });

      if (!stage) {
        throw new BadRequestException('Stage not found');
      }
    }

    // Verificar se agente existe e pertence ao tenant
    if (assignedTo) {
      const agent = await this.prisma.user.findFirst({
        where: { id: assignedTo, tenantId },
      });

      if (!agent) {
        throw new BadRequestException('Agent not found');
      }
    }

    // Verificar se propriedade existe e pertence ao tenant
    if (propertyId) {
      const property = await this.prisma.property.findFirst({
        where: { id: propertyId, tenantId },
      });

      if (!property) {
        throw new BadRequestException('Property not found');
      }
    }

    // Criar lead
    const lead = await this.prisma.lead.create({
      data: {
        tenantId,
        name,
        phone: phone ? normalizePhone(phone) : null,
        email: email ? normalizeEmail(email) : null,
        source,
        stageId,
        assignedTo,
        notesText,
        propertyId,
      },
      include: {
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        leadTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    // Adicionar tags se fornecidas
    if (tags && tags.length > 0) {
      await this.addTagsToLead(tenantId, lead.id, tags);
    }

    // Log de atividade
    await this.activityLogService.logActivity(
      tenantId,
      actorId || null,
      'Lead',
      lead.id,
      'LEAD_CREATED',
      {
        leadName: lead.name,
        source: lead.source,
      },
    );

    return lead;
  }

  async update(
    tenantId: string,
    id: string,
    updateLeadDto: UpdateLeadDto,
    actorId?: string,
  ): Promise<Lead> {
    const lead = await this.findOne(tenantId, id);

    const {
      name,
      phone,
      email,
      source,
      stageId,
      assignedTo,
      notesText,
      propertyId,
      tags,
    } = updateLeadDto;

    // Validar telefone se fornecido
    if (phone && !isValidPhone(phone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Validar email se fornecido
    if (email && !isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Verificar se já existe outro lead com mesmo telefone no tenant
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      const existingLead = await this.prisma.lead.findFirst({
        where: {
          tenantId,
          phone: normalizedPhone,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingLead) {
        throw new BadRequestException(
          'Lead with this phone number already exists',
        );
      }
    }

    // Verificar se já existe outro lead com mesmo email no tenant
    if (email) {
      const normalizedEmail = normalizeEmail(email);
      const existingLead = await this.prisma.lead.findFirst({
        where: {
          tenantId,
          email: normalizedEmail,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingLead) {
        throw new BadRequestException('Lead with this email already exists');
      }
    }

    // Verificar se stage existe e pertence ao tenant
    if (stageId) {
      const stage = await this.prisma.stage.findFirst({
        where: { id: stageId, tenantId },
      });

      if (!stage) {
        throw new BadRequestException('Stage not found');
      }
    }

    // Verificar se agente existe e pertence ao tenant
    if (assignedTo) {
      const agent = await this.prisma.user.findFirst({
        where: { id: assignedTo, tenantId },
      });

      if (!agent) {
        throw new BadRequestException('Agent not found');
      }
    }

    // Verificar se propriedade existe e pertence ao tenant
    if (propertyId) {
      const property = await this.prisma.property.findFirst({
        where: { id: propertyId, tenantId },
      });

      if (!property) {
        throw new BadRequestException('Property not found');
      }
    }

    // Atualizar lead
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && {
          phone: phone ? normalizePhone(phone) : null,
        }),
        ...(email !== undefined && {
          email: email ? normalizeEmail(email) : null,
        }),
        ...(source && { source }),
        ...(stageId !== undefined && { stageId }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(notesText !== undefined && { notesText }),
        ...(propertyId !== undefined && { propertyId }),
      },
      include: {
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        leadTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    // Atualizar tags se fornecidas
    if (tags !== undefined) {
      await this.updateLeadTags(tenantId, id, tags);
    }

    // Log de atividade
    await this.activityLogService.logActivity(
      tenantId,
      actorId || null,
      'Lead',
      id,
      'LEAD_UPDATED',
      {
        leadName: updatedLead.name,
      },
    );

    return updatedLead;
  }

  async move(
    tenantId: string,
    id: string,
    moveLeadDto: MoveLeadDto,
    actorId?: string,
  ): Promise<Lead> {
    const lead = await this.findOne(tenantId, id);
    const { stageId, notes } = moveLeadDto;

    // Verificar se stage existe e pertence ao tenant
    const stage = await this.prisma.stage.findFirst({
      where: { id: stageId, tenantId },
    });

    if (!stage) {
      throw new BadRequestException('Stage not found');
    }

    // Atualizar stage do lead
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { stageId },
      include: {
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        leadTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    // Log de atividade
    await this.activityLogService.logActivity(
      tenantId,
      actorId || null,
      'Lead',
      id,
      'LEAD_MOVED',
      {
        leadName: lead.name,
        fromStage: lead.stage?.name,
        toStage: stage.name,
        notes,
      },
    );

    return updatedLead;
  }

  async delete(tenantId: string, id: string, actorId?: string): Promise<void> {
    const lead = await this.findOne(tenantId, id);

    // Soft delete
    await this.prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Log de atividade
    await this.activityLogService.logActivity(
      tenantId,
      actorId || null,
      'Lead',
      id,
      'LEAD_DELETED',
      {
        leadName: lead.name,
      },
    );
  }

  async assignToAgent(
    tenantId: string,
    id: string,
    agentId: string,
    actorId?: string,
  ): Promise<Lead> {
    const lead = await this.findOne(tenantId, id);

    // Verificar se agente existe e pertence ao tenant
    const agent = await this.prisma.user.findFirst({
      where: { id: agentId, tenantId },
    });

    if (!agent) {
      throw new BadRequestException('Agent not found');
    }

    // Atualizar lead
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { assignedTo: agentId },
      include: {
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        leadTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    // Log de atividade
    await this.activityLogService.logActivity(
      tenantId,
      actorId || null,
      'Lead',
      id,
      'LEAD_ASSIGNED',
      {
        leadName: lead.name,
        agentName: agent.name,
      },
    );

    return updatedLead;
  }

  async unassignFromAgent(
    tenantId: string,
    id: string,
    actorId?: string,
  ): Promise<Lead> {
    const lead = await this.findOne(tenantId, id);

    // Atualizar lead
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { assignedTo: null },
      include: {
        stage: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        leadTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    // Log de atividade
    await this.activityLogService.logActivity(
      tenantId,
      actorId || null,
      'Lead',
      id,
      'LEAD_UNASSIGNED',
      {
        leadName: lead.name,
      },
    );

    return updatedLead;
  }

  private async addTagsToLead(
    tenantId: string,
    leadId: string,
    tagIds: string[],
  ): Promise<void> {
    // Verificar se todas as tags existem e pertencem ao tenant
    const tags = await this.prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        tenantId,
      },
    });

    if (tags.length !== tagIds.length) {
      throw new BadRequestException('Some tags not found');
    }

    // Adicionar tags ao lead
    await this.prisma.leadTag.createMany({
      data: tagIds.map((tagId) => ({
        leadId,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  private async updateLeadTags(
    tenantId: string,
    leadId: string,
    tagIds: string[],
  ): Promise<void> {
    // Remover tags existentes
    await this.prisma.leadTag.deleteMany({
      where: { leadId },
    });

    // Adicionar novas tags se fornecidas
    if (tagIds.length > 0) {
      await this.addTagsToLead(tenantId, leadId, tagIds);
    }
  }
}
