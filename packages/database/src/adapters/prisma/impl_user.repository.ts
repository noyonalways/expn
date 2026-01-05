
import { User } from '@expn/core/entities/user.entity';
import { CreateNewUserDTO, UserRepository, UserWithPassword } from '@expn/core/repositories/user.repository';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		return user ? this.toUser(user) : null;
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
		});

		return user ? this.toUser(user) : null;
	}
	async create(dto: CreateNewUserDTO): Promise<User> {
		const user = await this.prisma.user.create({
			data: {
				name: dto.name,
				email: dto.email,
				password: dto.password,
			},
		});

		return this.toUser(user);
	}
	async findByEmailWithPassword(
		email: string
	): Promise<UserWithPassword | null> {
		const user = await this.prisma.user.findUnique({ where: { email } });
		return user;
	}

	private toUser(user: PrismaUser): User {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}