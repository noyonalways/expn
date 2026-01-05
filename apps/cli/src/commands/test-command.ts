import { Command } from 'commander';
import inquirer from 'inquirer';

export const testCommand = new Command('test')
	.description('This is a test command')
	.action(async () => {
		const { username } = await inquirer.prompt([
			{ type: 'input', name: 'username', message: 'What is your name' },
		]);
		// DO Whatever you want
		console.log(`Hello ${username}`);
	});