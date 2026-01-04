import { Logger } from '@/interfaces/Logger';
import { AccountRepository } from '@/repositories/account.repository';
import { TransactionRepository } from '@/repositories/transaction.repository';

export class AddExpenseUseCase {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly transactionRepo: TransactionRepository,
		private readonly logger: Logger
	) {}

	/**
	 * Add an expense to the account
	 * @param accountId - The id of the account to add the expense to
	 * @param amount - The amount of the expense
	 * @returns The transaction history
	 */
	async execute(accountId: string, amount: number) {
		this.logger.info(`Adding expense of ${amount} to account ${accountId}`);
		// check if the account exist
		const account = await this.accountRepo.findById(accountId);
		if (!account) {
			throw new Error('Account not found');
		}

		// check if the amount is valid
		if (amount <= 0) {
			throw new Error('Invalid amount');
		}

		// Check if the account has necessary amount
		if (account.balance < amount) {
			this.logger.warn(`Insufficient balance for account ${accountId}`);
			throw new Error('Insufficient balance');
		}

		// create a transaction history
		const transaction = await this.transactionRepo.create({
			accountId,
			amount,
			type: 'expense',
			lastBalance: account.balance,
		});

		// update the account balance
		await this.accountRepo.updateBalance(accountId, account.balance - amount);

		this.logger.info(`Expense of ${amount} added to account ${accountId}`);
		return transaction;
	}
}