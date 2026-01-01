import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import lodash from "lodash";

export type TUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type TCurrency = "BDT" | "USD" | "EUR";

export type TAccount = {
  id: string;
  userId: string;
  currency: TCurrency;
  balance: number;
  lastUpdatedAt: Date;
};

export type TTransactionType = "income" | "expense" | "transfer";

export type TTransaction = {
  id: string;
  accountId: string;
  amount: number;
  type: TTransactionType;
  lastBalance: number;
  createdAt: Date;
};

type DB = {
  users: TUser[];
  accounts: TAccount[];
  transactions: TTransaction[];
};

// Extend Low class with a new `chain` field
class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}

const defaultData: DB = {
  users: [],
  accounts: [],
  transactions: [],
};

const adapter = new JSONFile<DB>("db.json");

export const db = new LowWithLodash(adapter, defaultData);
