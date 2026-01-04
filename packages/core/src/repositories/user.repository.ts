import { User } from "@/entities/user.entity";

export type CreateNewUserDTO = {
  name: string;
  email: string;
  password: string;
};

export type UserWithPassword = User & {
  password: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(dto: CreateNewUserDTO): Promise<User>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
}
