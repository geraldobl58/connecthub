import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Module({
  imports: [PrismaModule, PermissionsModule],
  controllers: [LeadsController],
  providers: [LeadsService, ActivityLogService],
  exports: [LeadsService],
})
export class LeadsModule {}
