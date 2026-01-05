import { UserLoginUseCase } from '@expn/core/use_cases/user-login';
import { Command } from 'commander';
import dependencies from '../dependencies';
import inquirer from 'inquirer';
import keytar from 'keytar';

export const loginCommand = new Command('login')
	.description('Please enter your email and password to login to the system')
	.action(async () => {
		const { email, password } = await inquirer.prompt([
			{ name: 'email', type: 'input', message: 'Please enter your email' },
			{
				name: 'password',
				type: 'password',
				message: 'Please enter your password',
			},
		]);

		try {
			const userLogin = new UserLoginUseCase(
				dependencies.repo.userRepository,
				dependencies.lib.hashPassword,
				dependencies.lib.jwt
			);
			const token = await userLogin.execute(email, password);
			await keytar.setPassword('expn-cli', 'token', token);

			console.log('Logged in successfully');
			console.log('Hello, ' + email);
		} catch (error) {
			console.error('Something went wrong. Please try again');
			console.log(error);
		}
	});