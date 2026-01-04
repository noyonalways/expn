import { Account, Currency, CurrencyType } from "@/entities/account.entity";

export interface AccountRepository {
	findById(id: string): Promise<Account | null>;
	findByUserId(userId: string): Promise<Account[]>;
	findByUserIdAndCurrency(
		userId: string,
		currency: CurrencyType
	): Promise<Account | null>;
	create(userId: string, currency: CurrencyType): Promise<Account>;
	updateBalance(accountId: string, balance: number): Promise<Account>;
	remove(accountId: string): Promise<void>;
}
