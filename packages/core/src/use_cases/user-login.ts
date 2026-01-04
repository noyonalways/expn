import { HashPassword } from "@/interfaces/HashPassword";
import { JsonWebToken } from "@/interfaces/JsonWebToken";
import { UserRepository } from "@/repositories/user.repository";

export class UserLoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
    private readonly jsonWebToken: JsonWebToken<{ userId: string }>
  ) {}

  async execute(email: string, password: string) {
    // Check if the user exist
    const user = await this.userRepo.findByEmailWithPassword(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user exist
    const isPasswordValid = await this.hashPassword.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate token
    const token = await this.jsonWebToken.sign({ userId: user.id });
    return token;
  }
}
