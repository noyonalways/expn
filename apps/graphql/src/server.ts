import { createSchema, createYoga } from "@graphql-yoga/node";
import express, { Application } from "express";
import { resolvers } from "./schema/resolvers";
import { Context } from "./context";
import { readFileSync } from "fs";
import path from "path";
import { UserLoginUseCase } from "@expn/core/use_cases/user-login";
import { CreateNewUserUseCase } from "@expn/core/use_cases/create-new-user";
import { CreateNewAccountUseCase } from "@expn/core/use_cases/create-new-account";
import { ViewAllAccountsUseCase } from "@expn/core/use_cases/view-all-accounts";
import {
  getAccountRepository,
  getTransactionRepository,
  getUserRepository,
} from "@expn/database";
import {
  BcryptjsHashPassword,
  ConsoleLogger,
  JsonWebTokenImpl,
} from "@expn/shared";
import { AddIncomeUseCase } from "@expn/core/use_cases/add-income";
import { AddExpenseUseCase } from "@expn/core/use_cases/add-expense";
import { ViewAllTransactionsByAccountIdUseCase } from "@expn/core/use_cases/view-all-transactions";

const userRepository = getUserRepository("prisma");
const accountRepository = getAccountRepository("prisma");
const transactionRepository = getTransactionRepository("prisma");

const hashPassword = new BcryptjsHashPassword();
const jwt = new JsonWebTokenImpl();
const logger = new ConsoleLogger();

export const startServer = async (
  port: number = 4000
): Promise<Application> => {
  const app = express();
  const typeDefs = readFileSync(
    path.join(__dirname, "schema/schema.graphql"),
    "utf-8"
  );

  const schema = createSchema({
    typeDefs,
    resolvers,
  });

  const server = createYoga({
    schema,
    context: (): Context =>
      ({
        useCases: {
          register: new CreateNewUserUseCase(
            userRepository,
            hashPassword,
            logger
          ),
          login: new UserLoginUseCase(userRepository, hashPassword, jwt),
          createAccount: new CreateNewAccountUseCase(accountRepository, logger),
          viewAccounts: new ViewAllAccountsUseCase(accountRepository, logger),
          viewAllTransactionsByAccountId: new ViewAllTransactionsByAccountIdUseCase(
            transactionRepository,
            logger
          ),
          addIncome: new AddIncomeUseCase(
            accountRepository,
            transactionRepository,
            logger
          ),
          addExpense: new AddExpenseUseCase(
            accountRepository,
            transactionRepository,
            logger
          ),
        },
      }) as Context,
  });

  app.use("/graphql", server);

  // Start server
  await new Promise<void>((resolve) => {
    app.listen(port, () => {
      console.log(`GraphQL server running at http://localhost:${port}/graphql`);
      resolve();
    });
  });

  return app;
};
