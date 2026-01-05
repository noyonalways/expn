import { relations } from 'drizzle-orm/relations';
import { usersTable, accountsTable, transactionsTable } from './schema';

export const accountsRelations = relations(accountsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [accountsTable.userId],
		references: [usersTable.id],
	}),
	transactions: many(transactionsTable),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
	accounts: many(accountsTable),
}));

export const transactionsRelations = relations(
	transactionsTable,
	({ one }) => ({
		account: one(accountsTable, {
			fields: [transactionsTable.accountId],
			references: [accountsTable.id],
		}),
	})
);