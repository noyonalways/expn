import { DrizzleClient } from "@/clients/drizzle";
import { accountsTable } from "../../drizzle/schema/schema";
import { Account, CurrencyType } from "@expn/core/entities/account.entity";
import { AccountRepository } from "@expn/core/repositories/account.repository";
import { eq } from "drizzle-orm";

export class DrizzleAccountRepository implements AccountRepository {
  constructor(private readonly drizzle: DrizzleClient) {}

  async findById(id: string): Promise<Account | null> {
    const rows = await this.drizzle
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.id, id));

    const account = rows[0];
    return account ? this.toAccount(account) : null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const rows = await this.drizzle
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId));

    return rows.map(this.toAccount);
  }

  async findByUserIdAndCurrency(
    userId: string,
    currency: CurrencyType
  ): Promise<Account | null> {
    const rows = await this.drizzle
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId))
      .$dynamic()
      .where(eq(accountsTable.currency, currency));

    const account = rows[0];
    return account ? this.toAccount(account) : null;
  }

  async create(userId: string, currency: CurrencyType): Promise<Account> {
    const rows = await this.drizzle
      .insert(accountsTable)
      .values({
        id: crypto.randomUUID(),
        userId,
        currency,
      })
      .returning();

    const account = rows[0];
    if (!account) {
      throw new Error("Failed to create account");
    }
    return this.toAccount(account);
  }

  async updateBalance(accountId: string, balance: number): Promise<Account> {
    const rows = await this.drizzle
      .update(accountsTable)
      .set({
        balance: balance.toString(),
        lastUpdatedAt: new Date(),
      })
      .where(eq(accountsTable.id, accountId))
      .returning();

    const account = rows[0];
    if (!account) {
      throw new Error("Account not found");
    }
    return this.toAccount(account);
  }

  async remove(accountId: string): Promise<void> {
    await this.drizzle
      .delete(accountsTable)
      .where(eq(accountsTable.id, accountId));
  }

  private toAccount(account: typeof accountsTable.$inferSelect): Account {
    return {
      id: account.id,
      userId: account.userId,
      currency: account.currency as CurrencyType,
      balance: Number(account.balance),
      lastUpdatedAt: account.lastUpdatedAt,
    };
  }
}
