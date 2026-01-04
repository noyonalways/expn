import { CreateNewUserDTO, UserRepository, UserWithPassword } from '@expn/core/repositories/user.repository';
import { User } from '@expn/core/entities/user.entity';

type UserData = User & {
	password: string;
};

// In memory database
export const users: UserData[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john.doe@example.com',
		password: 'password',
	},
];

export class InMemoryUserRepository implements UserRepository {
	/**
	 * This method should used only for login purposes
	 * @param email
	 * @returns
	 */
	findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
		const user = users.find((user) => user.email === email) || null;
		return Promise.resolve(user);
	}

	findByEmail(email: string): Promise<User | null> {
		const user = users.find((user) => user.email === email) || null;
		return Promise.resolve(user);
	}

	findById(id: string): Promise<User | null> {
		return Promise.resolve(users.find((user) => user.id === id) || null);
	}

	create(dto: CreateNewUserDTO): Promise<User> {
		const user = {
			...dto,
			id: crypto.randomUUID(),
		};
		users.push(user);

		return Promise.resolve(user);
	}
}