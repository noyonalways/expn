import { DrizzleClient } from "@/clients/drizzle";
import { accountsTable, transactionsTable } from "../../drizzle/schema/schema";
import { Transaction } from "@expn/core/entities/transaction.entity";
import { eq, gte, inArray, lte } from "drizzle-orm";
import {
  CreateTransactionDTO,
  TransactionFilter,
  TransactionPagination,
  TransactionRepository,
} from "@expn/core/repositories/transaction.repository";

export class DrizzleTransactionRepository implements TransactionRepository {
  constructor(private readonly drizzle: DrizzleClient) {}

  async create(input: CreateTransactionDTO): Promise<Transaction> {
    const transaction = await this.drizzle
      .insert(transactionsTable)
      .values({
        ...input,
        id: crypto.randomUUID(),
        amount: input.amount.toString(),
        lastBalance: input.lastBalance.toString(),
      })
      .returning();

    if (!transaction[0]) {
      throw new Error("Failed to create transaction");
    }

    return this.toTransaction(transaction[0]);
  }

  async findByAccountId(
    accountId: string,
    filter?: TransactionFilter
  ): Promise<Transaction[]> {
    const query = this.drizzle
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.accountId, accountId))
      .$dynamic();

    if (filter?.from) {
      query.where(gte(transactionsTable.createdAt, filter.from));
    }

    if (filter?.to) {
      query.where(lte(transactionsTable.createdAt, filter.to));
    }

    if (filter?.type) {
      query.where(eq(transactionsTable.type, filter.type));
    }

    const results = await query;
    return results.map(this.toTransaction);
  }

  async findByUserId(
    userId: string,
    filter?: TransactionFilter,
    pagination?: TransactionPagination
  ): Promise<Transaction[]> {
    // 1. Get all accounts for the user
    const accountsData = await this.drizzle
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId));

    // 2. Get all transactions for those accounts
    const accountIds = accountsData.map((account) => account.id);

    if (accountIds.length === 0) return [];

    let query = this.drizzle
      .select()
      .from(transactionsTable)
      .where(inArray(transactionsTable.accountId, accountIds))
      .$dynamic();

    // Optionally apply filters
    if (filter?.from) {
      query.where(gte(transactionsTable.createdAt, filter.from));
    }
    if (filter?.to) {
      query.where(lte(transactionsTable.createdAt, filter.to));
    }
    if (filter?.type) {
      query.where(eq(transactionsTable.type, filter.type));
    }

    // Optionally apply pagination
    if (pagination?.limit) {
      query.limit(pagination.limit);
    }
    if (pagination?.page && pagination?.limit) {
      query.offset((pagination.page - 1) * pagination.limit);
    }

    const transactionData = await query;

    return transactionData.map((transaction) =>
      this.toTransaction(transaction)
    );
  }

  async findAllByAccountId(
    accountId: string,
    filter?: TransactionFilter,
    pagination?: TransactionPagination
  ): Promise<Transaction[]> {
    return await this.findByAccountId(accountId, filter);
  }

  private toTransaction(
    transaction: typeof transactionsTable.$inferSelect
  ): Transaction {
    return {
      ...transaction,
      amount: Number(transaction.amount),
      lastBalance: Number(transaction.lastBalance),
    };
  }
}
