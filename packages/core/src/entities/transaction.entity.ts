export enum TransactionEnum {
	EXPENSE = 'expense',
	INCOME = 'income',
	TRANSFER = 'transfer',
}

export type TransactionType = `${TransactionEnum}`;

export interface Transaction {
	id: string;
	accountId: string;
	amount: number;
	type: TransactionType;
	lastBalance: number;
	createdAt: Date;
}