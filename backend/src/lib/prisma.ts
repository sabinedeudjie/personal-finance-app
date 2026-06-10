import { PrismaClient } from '../generated/client/client.js';
import { createDbAdapter } from './db-adapter.js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: createDbAdapter() });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
