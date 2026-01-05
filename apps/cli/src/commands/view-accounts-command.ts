import { Command } from 'commander';
import dependencies from '../dependencies';
import { ViewAllAccountsUseCase } from '@expn/core/use_cases/view-all-accounts';
import { withAuth } from '../utils/withAuth';

export const viewAccountsCommand = new Command('accounts')
	.description('Please enter your email and password to login to the system')
	.action(
		withAuth(async ({ userId }) => {
			try {
				const viewAccounts = new ViewAllAccountsUseCase(
					dependencies.repo.accountRepository,
					dependencies.lib.logger
				);

				const accounts = await viewAccounts.execute(userId);
				console.table(
					accounts.map((account) => ({
						ID: account.id,
						Currency: account.currency,
						Balance: `$${account.balance.toFixed(2)}`,
						'Last Updated At': new Date(account.lastUpdatedAt).toLocaleString(),
					}))
				);
			} catch (error) {
				console.error('Something went wrong. Please try again');
				console.log(error);
			}
		})
	);