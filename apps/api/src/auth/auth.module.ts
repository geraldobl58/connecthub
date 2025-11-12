import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { SignupService } from './signup.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from '../email/email.module';
import { StripeModule } from '../stripe/stripe.module';
import { PlansModule } from '../plans/plans.module';
import { TwoFactorModule } from '../two-factor/two-factor.module';

@Module({
  imports: [
    PassportModule,
    EmailModule,
    StripeModule,
    PlansModule,
    TwoFactorModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES') || '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SignupService, JwtStrategy],
  exports: [AuthService, SignupService, JwtStrategy],
})
export class AuthModule {}
