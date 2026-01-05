  import {
	CreateTransactionDTO,
	TransactionFilter,
	TransactionPagination,
	TransactionRepository,
} from '@expn/core/repositories/transaction.repository';
import { PrismaClient, Transaction } from '@prisma/client';

export class PrismaTransactionRepository implements TransactionRepository {
	constructor(private readonly prismaClient: PrismaClient) {}

	async create(input: CreateTransactionDTO): Promise<Transaction> {
		const transaction = await this.prismaClient.transaction.create({
			data: {
				...input,
				createdAt: new Date(),
			},
		});

		return transaction;
	}

	async findByAccountId(
		accountId: string,
		filter?: TransactionFilter
	): Promise<Transaction[]> {
		const transactions = await this.prismaClient.transaction.findMany({
			where: {
				accountId,
				...(filter?.type && {
					type: filter.type,
				}),
				...(filter?.from && {
					createdAt: {
						gte: filter.from,
					},
				}),
				...(filter?.to && {
					createdAt: {
						lte: filter.to,
					},
				}),
			},
		});

		return transactions;
	}

	async findByUserId(
		userId: string,
		filter?: TransactionFilter,
		pagination?: TransactionPagination
	): Promise<Transaction[]> {
		const transactions = await this.prismaClient.transaction.findMany({
			where: {
				account: {
					userId,
				},
				...(filter?.type && {
					type: filter.type,
				}),
				...(filter?.from && {
					createdAt: {
						gte: filter.from,
					},
				}),
				...(filter?.to && {
					createdAt: {
						lte: filter.to,
					},
				}),
			},
			skip: pagination?.page
				? (pagination.page - 1) * (pagination?.limit ?? 10)
				: undefined,
			take: pagination?.limit,
			orderBy: {
				createdAt: 'desc',
			},
		});

		return transactions;
	}
}