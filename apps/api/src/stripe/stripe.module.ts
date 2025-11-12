import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { AutoUpgradeService } from './auto-upgrade.service';

@Module({
  imports: [ConfigModule, PrismaModule, EmailModule],
  controllers: [StripeController],
  providers: [StripeService, AutoUpgradeService],
  exports: [StripeService, AutoUpgradeService],
})
export class StripeModule {}
