import { Transaction, TransactionType } from "@/entities/transaction.entity";

export type CreateTransactionDTO = Omit<Transaction, "id" | "createdAt">;
export type TransactionFilter = {
  from?: Date;
  to?: Date;
  type?: TransactionType;
};
export type TransactionPagination = {
  page?: number;
  limit?: number;
}

export interface TransactionRepository {
  create(input: CreateTransactionDTO): Promise<Transaction>;
  findByAccountId(
    accountId: string,
    filter?: TransactionFilter,
    pagination?: TransactionPagination
  ): Promise<Transaction[]>;
  findByUserId(
    userId: string,
    filter?: TransactionFilter,
    pagination?: TransactionPagination
  ): Promise<Transaction[]>;
}
