export enum Currency {
	BDT = 'BDT',
	USD = 'USD',
	EUR = 'EUR',
}

export type CurrencyType = `${Currency}`;

export interface Account {
	id: string;
	userId: string;
	currency: CurrencyType;
	balance: number;
	lastUpdatedAt: Date;
}