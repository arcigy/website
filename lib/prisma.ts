import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrisma = (): PrismaClient => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  // Explicitly passing datasourceUrl fixes Prisma 7's 'engine type client' error
  globalForPrisma.prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  
  return globalForPrisma.prisma;
};
