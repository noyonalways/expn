import { Command } from 'commander';
import dependencies from '../dependencies';
import { ViewAllTransactionsByAccountIdUseCase } from '@expn/core/use_cases/view-all-transactions';
import { withAuth } from '../utils/withAuth';
import { TransactionFilter } from '@expn/core/repositories/transaction.repository';

export const viewTransactionsCommand = new Command('transactions')
	.description('View all transactions for a specific account')
	.argument('<accountId>', 'The ID of the account to view transactions for')
	.option('-t, --type <type>', 'Filter transactions by type (income, expense, transfer)')
	.action(
		withAuth(async ({ userId }, accountId, options) => {
			try {
				const viewTransactions = new ViewAllTransactionsByAccountIdUseCase(
					dependencies.repo.transactionRepository,
					dependencies.lib.logger
				);

				const filter: TransactionFilter = {};
				if (options.type) {
					if (!['income', 'expense', 'transfer'].includes(options.type)) {
						console.error('Invalid transaction type. Must be income, expense, or transfer.');
						return;
					}
					filter.type = options.type;
				}

				const transactions = await viewTransactions.execute(accountId, filter);
				console.table(
					transactions.map((t) => ({
						ID: t.id,
						Type: t.type,
						Amount: `$${t.amount.toFixed(2)}`,
						'Last Balance': `$${t.lastBalance.toFixed(2)}`,
						'Created At': new Date(t.createdAt).toLocaleString(),
					}))
				);
			} catch (error) {
				console.error('Something went wrong. Please try again');
				console.log(error);
			}
		})
	);
