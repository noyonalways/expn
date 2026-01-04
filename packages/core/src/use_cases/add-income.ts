import { Logger } from '@/interfaces/Logger';
import { AccountRepository } from '@/repositories/account.repository';
import { TransactionRepository } from '@/repositories/transaction.repository';

export class AddIncomeUseCase {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly transactionRepo: TransactionRepository,
		private readonly logger: Logger
	) {}

	async execute(accountId: string, amount: number) {
		this.logger.info(`Adding income of ${amount} to account ${accountId}`);	
		// check if the user account exist
		const account = await this.accountRepo.findById(accountId);
		if (!account) {
			throw new Error('Account not found');
		}

		// check if the amount is valid
		if (amount <= 0) {
			throw new Error('Invalid amount');
		}

		// create a transaction history
		const transaction = await this.transactionRepo.create({
			accountId,
			amount,
			type: 'income',
			lastBalance: account.balance,
		});

		// update the account balance
		await this.accountRepo.updateBalance(accountId, account.balance + amount);

		this.logger.info(`Income of ${amount} added to account ${accountId}`);
		return transaction;
	}
}