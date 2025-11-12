import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { LimitMonitorService } from './limit-monitor.service';
import { EmailController } from './email.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmailController],
  providers: [EmailService, LimitMonitorService],
  exports: [EmailService, LimitMonitorService],
})
export class EmailModule {}
