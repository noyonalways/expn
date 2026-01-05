import { DrizzleClient } from "@/clients/drizzle";
import { usersTable } from "../../drizzle/schema/schema";
import { User } from "@expn/core/entities/user.entity";
import {
  CreateNewUserDTO,
  UserRepository,
  UserWithPassword,
} from "@expn/core/repositories/user.repository";
import { eq } from "drizzle-orm";

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly drizzle: DrizzleClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.drizzle
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = rows[0];
    return user ? this.toUser(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.drizzle
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    const user = rows[0];
    return user ? this.toUser(user) : null;
  }

  async create(dto: CreateNewUserDTO): Promise<User> {
    const rows = await this.drizzle
      .insert(usersTable)
      .values({
        id: crypto.randomUUID(),
        name: dto.name,
        email: dto.email,
        password: dto.password,
      })
      .returning();

    const user = rows[0];
    if (!user) {
      throw new Error("Failed to create user");
    }

    return this.toUser(user);
  }

  async findByEmailWithPassword(
    email: string
  ): Promise<UserWithPassword | null> {
    const rows = await this.drizzle
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = rows[0];
    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        }
      : null;
  }

  private toUser(user: typeof usersTable.$inferSelect): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
