import { Command } from 'commander';
import dependencies from '../dependencies';
import inquirer from 'inquirer';
import { AddIncomeUseCase } from '@expn/core/use_cases/add-income';
import { AddExpenseUseCase } from '@expn/core/use_cases/add-expense';
import { withAuth } from '../utils/withAuth';

export const addTransactionCommand = new Command('transaction')
	.description('Please enter your email and password to login to the system')
	.action(
		withAuth(async () => {
			try {
				const { accountId, amount, type } = await inquirer.prompt([
					{
						name: 'accountId',
						type: 'input',
						message: 'Please enter the account ID',
					},

					{
						name: 'type',
						type: 'list',
						message: 'Please select the transaction type',
						choices: ['income', 'expense'],
					},
					{
						name: 'amount',
						type: 'number',
						message: 'Please enter the amount',
					},
				]);

				if (type === 'income') {
					const addIncome = new AddIncomeUseCase(
						dependencies.repo.accountRepository,
						dependencies.repo.transactionRepository,
						dependencies.lib.logger
					);

					const transaction = await addIncome.execute(accountId, amount);
					console.log('Income added successfully');
					console.log(JSON.stringify(transaction, null, 2));
					return;
				}

				if (type === 'expense') {
					const addExpense = new AddExpenseUseCase(
						dependencies.repo.accountRepository,
						dependencies.repo.transactionRepository,
						dependencies.lib.logger
					);

					const transaction = await addExpense.execute(accountId, amount);
					console.log('Expense added successfully');
					console.log(JSON.stringify(transaction, null, 2));
					return;
				}
			} catch (error) {
				console.error('Something went wrong. Please try again');
				console.log(error);
			}
		})
	);