import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Lazy initialization for serverless / edge compatibility
export function getPrisma(): PrismaClient {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma can only be used on the server side.');
  }

  const prisma = globalThis.prisma ?? prismaClientSingleton()
  
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma
  }
  
  return prisma
}
