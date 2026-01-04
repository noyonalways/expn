import {
	CreateTransactionDTO,
	TransactionFilter,
	TransactionPagination,
	TransactionRepository,
} from '@expn/core/repositories/transaction.repository';
import { Transaction } from '@expn/core/entities/transaction.entity';

const transactions: Transaction[] = [];

export class InMemoryTransactionRepository implements TransactionRepository {
	create(input: CreateTransactionDTO): Promise<Transaction> {
		const transaction: Transaction = {
			id: crypto.randomUUID(),
			accountId: input.accountId,
			amount: input.amount,
			type: input.type,
			lastBalance: input.lastBalance,
			createdAt: new Date(),
		};

		transactions.push(transaction);
		return Promise.resolve(transaction);
	}

	findByAccountId(
		accountId: string,
		filter?: TransactionFilter
	): Promise<Transaction[]> {
		return Promise.resolve(
			transactions.filter((transaction) => {
				let matches = transaction.accountId === accountId;

				if (filter?.type) {
					matches = matches && transaction.type === filter.type;
				}

				if (filter?.from) {
					matches = matches && transaction.createdAt >= filter.from;
				}

				if (filter?.to) {
					matches = matches && transaction.createdAt <= filter.to;
				}

				return matches;
			})
		);
	}

	findByUserId(
		userId: string,
		filter?: TransactionFilter,
		pagination?: TransactionPagination
	): Promise<Transaction[]> {
		let filtered = transactions.filter((transaction) => {
			let matches = true;

			if (filter?.type) {
				matches = matches && transaction.type === filter.type;
			}

			if (filter?.from) {
				matches = matches && transaction.createdAt >= filter.from;
			}

			if (filter?.to) {
				matches = matches && transaction.createdAt <= filter.to;
			}

			return matches;
		});

		if (pagination) {
			const page = pagination.page || 1;
			const limit = pagination.limit || 10;
			const start = (page - 1) * limit;
			const end = start + limit;
			filtered = filtered.slice(start, end);
		}

		return Promise.resolve(filtered);
	}
}