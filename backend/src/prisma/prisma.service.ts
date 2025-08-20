import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDb() {
    // For testing purposes
    if (this.configService.get('NODE_ENV') === 'test') {
      const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

      return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    }
  }
}
