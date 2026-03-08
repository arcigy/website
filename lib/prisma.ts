import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL
  
  if (!url) {
    // Kvoli Next.js buildu na Railway, kde tato premenna moze chybat
    return new PrismaClient({
      datasourceUrl: "postgresql://dummy:dummy@localhost:5432/dummy"
    })
  }
  
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
