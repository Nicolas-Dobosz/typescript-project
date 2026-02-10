import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/typescript_project';

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: databaseUrl,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

