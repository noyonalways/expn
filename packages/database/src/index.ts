// Clients
import { prismaClient } from "./clients/prisma";
import { drizzleClient } from "./clients/drizzle";

// Repositories
import { InMemoryUserRepository } from "./adapters/in_memory/impl_user.repository";
import { InMemoryAccountRepository } from "./adapters/in_memory/impl_account.repository";
import { InMemoryTransactionRepository } from "./adapters/in_memory/impl_transaction.repository";
import { PrismaUserRepository } from "./adapters/prisma/impl_user.repository";
import { PrismaAccountRepository } from "./adapters/prisma/impl_account.repository";
import { PrismaTransactionRepository } from "./adapters/prisma/impl_transaction.repository";
import { DrizzleUserRepository } from "./adapters/drizzle/impl_user.repository";
import { DrizzleAccountRepository } from "./adapters/drizzle/impl_account.repository";
import { DrizzleTransactionRepository } from "./adapters/drizzle/impl_transaction.repository";

export type Adapter = "in-memory" | "prisma" | "drizzle";

export const getUserRepository = (adapter: Adapter = "in-memory") => {
  if (adapter === "prisma") {
    return new PrismaUserRepository(prismaClient);
  }

  if (adapter === "drizzle") {
    return new DrizzleUserRepository(drizzleClient);
  }

  return new InMemoryUserRepository();
};

export const getAccountRepository = (adapter: Adapter = "in-memory") => {
  if (adapter === "prisma") {
    return new PrismaAccountRepository(prismaClient);
  }

  if (adapter === "drizzle") {
    return new DrizzleAccountRepository(drizzleClient);
  }

  return new InMemoryAccountRepository();
};

export const getTransactionRepository = (adapter: Adapter = "in-memory") => {
  if (adapter === "prisma") {
    return new PrismaTransactionRepository(prismaClient);
  }

  if (adapter === "drizzle") {
    return new DrizzleTransactionRepository(drizzleClient);
  }

  return new InMemoryTransactionRepository();
};
