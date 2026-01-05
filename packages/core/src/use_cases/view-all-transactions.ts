import { Transaction } from "@/entities/transaction.entity";
import { Logger } from "@/interfaces/Logger";
import {
  TransactionFilter,
  TransactionPagination,
  TransactionRepository,
} from "@/repositories/transaction.repository";

export class ViewAllTransactionsByAccountIdUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private logger: Logger
  ) {}

  async execute(
    accountId: string,
    filter?: TransactionFilter,
    pagination?: TransactionPagination
  ): Promise<Transaction[]> {
    this.logger.info("Viewing all transactions");
    return await this.transactionRepository.findAllByAccountId(accountId, filter, pagination);
  }
}
