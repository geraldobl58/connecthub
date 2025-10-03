import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PropertyUploadController } from './property-upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MediaModule } from '../media/media.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, MediaModule, PermissionsModule],
  controllers: [PropertyController, PropertyUploadController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
