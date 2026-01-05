import dependencies from '../dependencies';
import keytar from 'keytar';

export function withAuth<T>(
	callback: (user: { userId: string }, ...args: any[]) => Promise<T>
) {
	return async (...args: any[]) => {
		try {
			const token = await keytar.getPassword('expn-cli', 'token');
			if (!token) {
				throw new Error('Please login to the system first');
			}

			const user = await dependencies.lib.jwt.verify(token);
			return callback(user, ...args);
		} catch (error) {
			console.error('Authentication failed');
			process.exit(1);
		}
	};
}