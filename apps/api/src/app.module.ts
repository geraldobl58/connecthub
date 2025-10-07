import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlansModule } from './plans/plans.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { StagesModule } from './stages/stages.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { OwnersModule } from './owners/owners.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PlansModule,
    PermissionsModule,
    UsersModule,
    StagesModule,
    ActivityLogModule,
    OwnersModule,
    PropertiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
