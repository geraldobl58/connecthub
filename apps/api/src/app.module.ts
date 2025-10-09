import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlansModule } from './plans/plans.module';
import { StripeModule } from './stripe/stripe.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { OwnersModule } from './owners/owners.module';
import { PropertiesModule } from './properties/properties.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PlansModule,
    StripeModule,
    PermissionsModule,
    UsersModule,
    OwnersModule,
    PropertiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
