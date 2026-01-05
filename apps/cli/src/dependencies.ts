import {
	getAccountRepository,
	getTransactionRepository,
	getUserRepository,
} from '@expn/database';
import {
	BcryptjsHashPassword,
	ConsoleLogger,
	JsonWebTokenImpl,
} from '@expn/shared';

const hashPassword = new BcryptjsHashPassword();
const jwt = new JsonWebTokenImpl<{ userId: string }>();
const logger = new ConsoleLogger();

const userRepository = getUserRepository('prisma');
const transactionRepository = getTransactionRepository('prisma');
const accountRepository = getAccountRepository('prisma');

export default {
	lib: {
		hashPassword,
		jwt,
		logger,
	},
	repo: {
		userRepository,
		transactionRepository,
		accountRepository,
	},
};