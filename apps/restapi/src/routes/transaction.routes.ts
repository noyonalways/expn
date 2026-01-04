import { Logger } from '@expn/core/interfaces/Logger';
import { AddExpenseUseCase } from '@expn/core/use_cases/add-expense';
import { AddIncomeUseCase } from '@expn/core/use_cases/add-income';
import { InMemoryAccountRepository } from '@expn/database/adapters/in_memory/impl_account.repository';
import { InMemoryTransactionRepository } from '@expn/database/adapters/in_memory/impl_transaction.reposity';
import { Application, Router, Request, Response } from 'express';

type Dependencies = {
	logger: Logger;
};

export const transactionRoutes = (app: Application, deps: Dependencies) => {
	const router: Router = Router();

	router.post('/expense', async (req: Request, res: Response) => {
		const addExpense = new AddExpenseUseCase(
      new InMemoryAccountRepository(),
			new InMemoryTransactionRepository(),
			deps.logger
		);

		const transaction = await addExpense.execute(
			req.body.accountId,
			req.body.amount
		);

		res.status(201).json({
			message: 'Expense added successfully',
			transaction,
		});
	});

	router.post('/income', async (req: Request, res: Response) => {
		const addIncome = new AddIncomeUseCase( 
			new InMemoryAccountRepository(),
			new InMemoryTransactionRepository(),
			deps.logger
		);

		const transaction = await addIncome.execute(
			req.body.accountId,
			req.body.amount
		);

		res.status(201).json({
			message: 'Income added successfully',
			transaction,
		});
	});

	app.use('/transactions', router);
};