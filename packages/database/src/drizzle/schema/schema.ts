import {
	pgTable,
	uniqueIndex,
	text,
	foreignKey,
	numeric,
	timestamp,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { unique } from 'drizzle-orm/pg-core';

export const transactionType = pgEnum('TransactionType', [
	'income',
	'expense',
	'transfer',
]);

export const usersTable = pgTable('users', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
});

export const accountsTable = pgTable(
	'accounts',
	{
		id: text('id').primaryKey().notNull(),
		balance: numeric('balance', { precision: 10, scale: 2 })
			.notNull()
			.default(sql`0`),
		currency: text('currency').notNull(),
		lastUpdatedAt: timestamp('last_updated_at').defaultNow().notNull(),
		userId: text('user_id').notNull(),
	},
	(table) => [unique().on(table.userId, table.currency)]
);

export const transactionsTable = pgTable('transactions', {
	id: text('id').primaryKey().notNull(),
	type: transactionType('type').notNull(),
	amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
	lastBalance: numeric('last_balance', { precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	accountId: text('account_id').notNull(),
});