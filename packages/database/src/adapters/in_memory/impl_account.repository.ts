import { AccountRepository } from '@expn/core/repositories/account.repository';
import { Account, Currency } from '@expn/core/entities/account.entity';

const accounts: Account[] = [];

export class InMemoryAccountRepository implements AccountRepository {
	findById(id: string): Promise<Account | null> {
		return Promise.resolve(
			accounts.find((account) => account.id === id) ?? null
		);
	}
	findByUserId(userId: string): Promise<Account[]> {
		return Promise.resolve(
			accounts.filter((account) => account.userId === userId)
		);
	}
	findByUserIdAndCurrency(
		userId: string,
		currency: string
	): Promise<Account | null> {
		return Promise.resolve(
			accounts.find(
				(account) => account.userId === userId && account.currency === currency
			) ?? null
		);
	}
	create(userId: string, currency: Currency): Promise<Account> {
		const account = {
			id: crypto.randomUUID(),
			userId,
			currency,
			balance: 0,
			lastUpdatedAt: new Date(),
		};
		accounts.push(account);
		return Promise.resolve(account);
	}
	async updateBalance(accountId: string, balance: number): Promise<Account> {
		const account = await this.findById(accountId);
		if (!account) {
			throw new Error('Account not found');
		}
		account.balance = balance;
		account.lastUpdatedAt = new Date();
		return Promise.resolve(account);
	}
	async remove(accountId: string): Promise<void> {
		const index = accounts.findIndex((account) => account.id === accountId);
		if (index === -1) {
			throw new Error('Account not found');
		}
		accounts.splice(index, 1);
		return Promise.resolve();
	}
}