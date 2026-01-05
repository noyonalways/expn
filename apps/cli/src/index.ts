import { Command } from 'commander';
import { testCommand } from './commands/test-command';
import { loginCommand } from './commands/login-command';
import { viewAccountsCommand } from './commands/view-accounts-command';
import { viewTransactionsCommand } from './commands/view-transactions-command';
import { addTransactionCommand } from './commands/transaction-command';
import { logoutCommand } from './commands/logout-command';

const program = new Command();
program
	.name('EXPN CLI')
	.description('A simple cli application created for EXPN corporation')
	.version('1.0.0');

program
	.command('init')
	.description('Initialize EXPN')
	.action(() => {
		console.log('Initializing EXPN...');
	});

// Routing to different commands
program.addCommand(testCommand);
program.addCommand(loginCommand);
program.addCommand(viewAccountsCommand);
program.addCommand(viewTransactionsCommand);
program.addCommand(addTransactionCommand);
program.addCommand(logoutCommand);

program.parse(process.argv);