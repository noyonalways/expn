import { Currency, Account } from '@/entities/account.entity';
import { Logger } from '@/interfaces/Logger';
import { AccountRepository } from '@/repositories/account.repository';

export class CreateNewAccountUseCase {
	constructor(private readonly accountRepo: AccountRepository, private readonly logger: Logger) {}

	async execute(userId: string, currency: Currency): Promise<Account> {
		// check if the user account exist
		const existingAccount = await this.accountRepo.findByUserIdAndCurrency(
			userId,
			currency
		);
		this.logger.info(`Checking if account exist for user ${userId} and currency ${currency}`);
		if (existingAccount) {
			this.logger.warn(`Account already exist for user ${userId} and currency ${currency}`);
			throw new Error('Account already exist');
		}

		const account = await this.accountRepo.create(userId, currency);
		this.logger.info(`Account created for user ${userId} and currency ${currency}`);
		return account;
	}
}