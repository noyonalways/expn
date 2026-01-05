import { Context } from '@/context';
import { Resolvers } from './types';

export const resolvers: Resolvers<Context> = {
	Query: {
		accounts: async (_, { userId }, { useCases }) => {
			const accounts = await useCases.viewAccounts.execute(userId);
			return accounts;
		},
		account: async (_, { id }, { useCases }) => {
			const account = await useCases.viewAccounts.execute(id);
			return account;
		},
		transactions: async (_, { accountId, filter }, { useCases }) => {
			return [
				{
					id: '1',
					accountId: accountId,
					amount: 100,
					type: 'income',
					createdAt: new Date().toISOString(),
					lastBalance: 100,
				},
			];
		},
	},

	/**
	 * Mutations
	 */
	Mutation: {
		register: async (_, { name, email, password }, { useCases }) => {
			const user = await useCases.register.execute({
				name,
				email,
				password,
			});
			return user;
		},
		login: async (_, { email, password }, { useCases }) => {
			const token = await useCases.login.execute(email, password);
			return { token };
		},
		createAccount: async (_, { accountId, currency }, { useCases }) => {
			const account = await useCases.createAccount.execute(accountId, currency);
			return account;
		},
		addIncome: async (_, { accountId, amount }, { useCases }) => {
			const transaction = await useCases.addIncome.execute(accountId, amount);
			return transaction;
		},
		addExpense: async (_, { accountId, amount }, { useCases }) => {
			const transaction = await useCases.addExpense.execute(accountId, amount);
			return transaction;
		},
	},
};