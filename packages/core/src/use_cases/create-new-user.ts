import { HashPassword } from '@/interfaces/HashPassword';
import { Logger } from '@/interfaces/Logger';

import {
	CreateNewUserDTO,
	UserRepository,
} from '@/repositories/user.repository';

export class CreateNewUserUseCase {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly hashPassword: HashPassword,
		private readonly logger: Logger
	) {}

	async execute(input: CreateNewUserDTO) {
		this.validate(input);

		// Find if the user already exist: User Table
		const existingUser = await this.userRepo.findByEmail(input.email)
		if (existingUser) {
			this.logger.warn(`User already exists: ${input.email}`);
			throw new Error('Email already in use');
		}

		this.logger.info(`Creating new user: ${input.email}`);

		// Hash the password
		const hashedPassword = await this.hashPassword.hash(input.password);
		input.password = hashedPassword;

		// Create new user
		const newUser = await this.userRepo.create(input);
		this.logger.info(`New user created: ${newUser.id}`);

		return newUser;
	}

	/**
	 * Private helper methods
	 */
	validate(dto: CreateNewUserDTO) {
		if (!dto.name || !dto.email || !dto.password) {
			throw new Error('Name, email and password are required');
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(dto.email)) {
			throw new Error('Invalid email format');
		}

		if (dto.password.length < 8) {
			throw new Error('Password must be at least 8 characters long');
		}
	}
}