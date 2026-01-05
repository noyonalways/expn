import { AddExpenseUseCase } from '@expn/core/use_cases/add-expense';
import { AddIncomeUseCase } from '@expn/core/use_cases/add-income';
import { CreateNewAccountUseCase } from '@expn/core/use_cases/create-new-account';
import { CreateNewUserUseCase } from '@expn/core/use_cases/create-new-user';
import { UserLoginUseCase } from '@expn/core/use_cases/user-login';
import { ViewAllAccountsUseCase } from '@expn/core/use_cases/view-all-accounts';

export interface Context {
	useCases: {
		register: CreateNewUserUseCase;
		login: UserLoginUseCase;
		createAccount: CreateNewAccountUseCase;
		viewAccounts: ViewAllAccountsUseCase;
		addIncome: AddIncomeUseCase;
		addExpense: AddExpenseUseCase;
	};
}