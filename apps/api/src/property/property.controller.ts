import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetCurrentUser } from '../common/decorators/current-user-decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.AGENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new property',
    description:
      'Creates a new property. Requires ADMIN, MANAGER, or AGENT role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully',
    type: PropertyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Property code already exists',
  })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @GetCurrentUser('tenantId') tenantId: string,
  ): Promise<PropertyResponseDto> {
    return this.propertyService.create(createPropertyDto, tenantId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.AGENT, Role.VIEWER)
  @ApiOperation({
    summary: 'Get all properties',
    description:
      'Retrieves a paginated list of properties for the current tenant.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PropertyResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - insufficient permissions',
  })
  async findAll(
    @GetCurrentUser('tenantId') tenantId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.propertyService.findAll(tenantId, page, limit);
  }

  @Get('search')
  @Roles(Role.ADMIN, Role.MANAGER, Role.AGENT, Role.VIEWER)
  @ApiOperation({
    summary: 'Search properties',
    description: 'Search properties with filters for the current tenant.',
  })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Property type filter',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Property status filter',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PropertyResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - insufficient permissions',
  })
  async search(
    @GetCurrentUser('tenantId') tenantId: string,
    @Query('q') query?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.propertyService.search(
      tenantId,
      query || '',
      type,
      status,
      page,
      limit,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.AGENT, Role.VIEWER)
  @ApiOperation({
    summary: 'Get property by ID',
    description: 'Retrieves a specific property by ID for the current tenant.',
  })
  @ApiResponse({
    status: 200,
    description: 'Property retrieved successfully',
    type: PropertyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - insufficient permissions',
  })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser('tenantId') tenantId: string,
  ): Promise<PropertyResponseDto> {
    return this.propertyService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.AGENT)
  @ApiOperation({
    summary: 'Update property',
    description: 'Updates a property. Requires ADMIN, MANAGER, or AGENT role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Property updated successfully',
    type: PropertyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Property code already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetCurrentUser('tenantId') tenantId: string,
  ): Promise<PropertyResponseDto> {
    return this.propertyService.update(id, updatePropertyDto, tenantId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete property',
    description: 'Soft deletes a property. Requires ADMIN or MANAGER role.',
  })
  @ApiResponse({
    status: 204,
    description: 'Property deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  async remove(
    @Param('id') id: string,
    @GetCurrentUser('tenantId') tenantId: string,
  ): Promise<void> {
    return this.propertyService.remove(id, tenantId);
  }
}
