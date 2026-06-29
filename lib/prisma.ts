import { prisma } from '@/lib/prisma'

export const prismaClient = prisma

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}
