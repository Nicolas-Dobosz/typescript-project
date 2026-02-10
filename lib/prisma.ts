import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaMariaDb({
  host: process.env["HOST"],
  port: Number(process.env["PORT"]),
  user: process.env["USER"],
  password: process.env["PASSWORD"],
  database: process.env["DATABASE"]
})

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma