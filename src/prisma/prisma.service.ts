import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private clientMap = new Map<string, PrismaClient>();

  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    for (const client of this.clientMap.values()) {
      await client.$disconnect();
    }
  }

  getClient(tenantId: string): PrismaClient {
    if (this.clientMap.has(tenantId)) {
      return this.clientMap.get(tenantId);
    }

    const databaseUrl = this.config
      .get('DATABASE_URL')
      .replace(this.config.get('POSTGRES_DATABASE'), tenantId);

    const client = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    this.clientMap.set(tenantId, client);
    return client;
  }
}
