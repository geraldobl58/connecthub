import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlansModule } from './plans/plans.module';
import { StripeModule } from './stripe/stripe.module';
import { LoggerModule } from './logger/logger.module';
import { EmailModule } from './email/email.module';
import { TwoFactorModule } from './two-factor/two-factor.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 3600000, // 1 hora em milissegundos
        limit: 100, // limite padrão (STARTER)
      },
    ]),
    PrismaModule,
    AuthModule,
    PlansModule,
    StripeModule,
    EmailModule,
    TwoFactorModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
