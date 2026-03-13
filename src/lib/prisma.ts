import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function withPgBouncer(url?: string) {
  if (!url) return url;
  // Supabase Pooler uses PgBouncer. Prisma needs `pgbouncer=true` to avoid prepared statement errors.
  if (!url.includes("pooler.supabase.com")) return url;
  if (url.includes("pgbouncer=true")) return url;
  return url.includes("?") ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: withPgBouncer(process.env.DATABASE_URL),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
