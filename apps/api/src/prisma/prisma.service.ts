import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ log: ['query', 'info', 'warn', 'error'] });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma connected');
    } catch (error) {
      console.error('❌ Prisma connection error:', error);
      // rethrow if you want to fail fast
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('✅ Prisma disconnected');
    } catch (error) {
      console.error('❌ Prisma disconnect error:', error);
    }
  }

  enableShutdownHooks(app: INestApplication) {
    // Prisma typings can be strict about events; use a safe fallback
    try {
      // @ts-expect-error runtime event name
      this.$on('beforeExit', () => {
        void app.close();
      });
    } catch {
      // fallback to process hook
      process.on('beforeExit', () => {
        void app.close();
      });
    }
  }
}
