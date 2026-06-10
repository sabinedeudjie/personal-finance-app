import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/client/client.js';
import { createDbAdapter } from '../lib/db-adapter.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ adapter: createDbAdapter() });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
