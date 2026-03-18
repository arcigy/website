import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrisma = (): PrismaClient => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  return globalForPrisma.prisma;
};
