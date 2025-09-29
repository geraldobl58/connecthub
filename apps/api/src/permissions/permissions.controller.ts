import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Get all role permissions',
    description:
      'Returns all roles and their permissions. Only ADMIN and MANAGER can access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role permissions retrieved successfully',
    schema: {
      example: [
        {
          role: 'ADMIN',
          permissions: [
            {
              resource: 'users',
              actions: ['create', 'read', 'update', 'delete'],
            },
            {
              resource: 'properties',
              actions: ['create', 'read', 'update', 'delete'],
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getAllRolePermissions() {
    return this.permissionsService.getAllRolePermissions();
  }

  @Get('check/:role/:resource/:action')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Check permission for role',
    description:
      'Checks if a specific role has permission for a resource and action.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission check result',
    schema: {
      example: {
        hasPermission: true,
        role: 'ADMIN',
        resource: 'users',
        action: 'create',
      },
    },
  })
  checkPermission(role: Role, resource: string, action: string) {
    const hasPermission = this.permissionsService.hasPermission(
      role,
      resource,
      action,
    );

    return {
      hasPermission,
      role,
      resource,
      action,
    };
  }
}
