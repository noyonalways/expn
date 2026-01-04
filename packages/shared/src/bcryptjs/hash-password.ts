import bcrypt from "bcryptjs";
import { HashPassword } from "@expn/core/interfaces/HashPassword";

export class BcryptjsHashPassword implements HashPassword {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
