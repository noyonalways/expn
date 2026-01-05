import { Account, Currency } from '@expn/core/entities/account.entity';
import { AccountRepository } from '@expn/core/repositories/account.repository';
import { PrismaClient, Account as PrismaAccount } from '@prisma/client';

export class PrismaAccountRepository implements AccountRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findById(id: string): Promise<Account | null> {
		const account = await this.prisma.account.findUnique({
			where: { id },
		});
		return account ? this.toAccount(account) : null;
	}

	async findByUserId(userId: string): Promise<Account[]> {
		const accounts = await this.prisma.account.findMany({
			where: { userId },
		});

		return accounts.map(this.toAccount);
	}

	async findByUserIdAndCurrency(
		userId: string,
		currency: string
	): Promise<Account | null> {
		const account = await this.prisma.account.findFirst({
			where: { userId, currency },
		});
		return account ? this.toAccount(account) : null;
	}

	async create(userId: string, currency: Currency): Promise<Account> {
		const account = await this.prisma.account.create({
			data: { userId, currency, balance: 0, lastUpdatedAt: new Date() },
		});
		return this.toAccount(account);
	}

	async updateBalance(accountId: string, balance: number): Promise<Account> {
		const account = await this.prisma.account.update({
			where: { id: accountId },
			data: { balance },
		});
		return this.toAccount(account);
	}

	async remove(accountId: string): Promise<void> {
		await this.prisma.account.delete({
			where: { id: accountId },
		});
	}

	private toAccount(account: PrismaAccount): Account {
		return {
			...account,
			balance: account.balance.toNumber(),
			currency: account.currency as Currency,
		};
	}
}