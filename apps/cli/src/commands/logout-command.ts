import { Command } from 'commander';
import keytar from 'keytar';

export const logoutCommand = new Command('logout')
	.description('Logout from the system')
	.action(async () => {
		await keytar.deletePassword('expn-cli', 'token');
		console.log('Logged out successfully');
	});