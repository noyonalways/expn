import { Logger } from '@expn/core/interfaces/Logger';
import { AccountRepository } from '@expn/core/repositories/account.repository';
import { TransactionRepository } from '@expn/core/repositories/transaction.repository';
import { AddExpenseUseCase } from '@expn/core/use_cases/add-expense';
import { AddIncomeUseCase } from '@expn/core/use_cases/add-income';
import { Application, Router, Request, Response } from 'express';

type Dependencies = {
	logger: Logger;
	accountRepository: AccountRepository;
	transactionRepository: TransactionRepository;
};

export const transactionRoutes = (app: Application, deps: Dependencies) => {
	const router: Router = Router();

	router.post('/expense', async (req: Request, res: Response) => {
		const addExpense = new AddExpenseUseCase(
      deps.accountRepository,
			deps.transactionRepository,
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
			deps.accountRepository,
			deps.transactionRepository,
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