import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrisma = (): PrismaClient => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    // During build without DATABASE_URL, return a proxy to avoid constructor errors if possible
    console.warn('DATABASE_URL is missing during production build.');
  }

  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  
  return globalForPrisma.prisma;
};

export const prisma = getPrisma();
