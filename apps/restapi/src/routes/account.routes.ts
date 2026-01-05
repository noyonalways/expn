import { Logger } from '@expn/core/interfaces/Logger';
import { AccountRepository } from '@expn/core/repositories/account.repository';
import { CreateNewAccountUseCase } from '@expn/core/use_cases/create-new-account';
import { ViewAllAccountsUseCase } from '@expn/core/use_cases/view-all-accounts';
import { Application, Router, Request, Response } from 'express';

type Dependencies = {
	logger: Logger;
	accountRepository: AccountRepository;
};

export const accountRoutes = (app: Application, deps: Dependencies) => {
	const router: Router = Router();

	router.post('/', async (req: Request, res: Response) => {
		const createAccount = new CreateNewAccountUseCase(
      deps.accountRepository,
      deps.logger
    );

		const account = await createAccount.execute(
			req.body.userId,
			req.body.currency
		);

		res.status(201).json({
			message: 'Account created successfully',
			account,
		});
	});

	router.get('/:userId', async (req: Request, res: Response) => {
		const viewAccounts = new ViewAllAccountsUseCase(
      deps.accountRepository,
      deps.logger
    );

		const accounts = await viewAccounts.execute(req.params.userId!);
		res.status(200).json(accounts);
	});

	app.use('/accounts', router);
};