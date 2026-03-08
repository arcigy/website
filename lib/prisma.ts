import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export function getPrisma(): PrismaClient {
  // Check if we are on server-side
  if (typeof window !== 'undefined') {
    throw new Error('Prisma cannot be used on client side');
  }

  if (process.env.NODE_ENV === 'production') {
    if (!globalThis.prisma) {
      globalThis.prisma = prismaClientSingleton()
    }
    return globalThis.prisma
  }

  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton()
  }
  return globalThis.prisma
}
