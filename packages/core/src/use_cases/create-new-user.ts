import { Account, CurrencyType } from "@/entities/account.entity";
import { AccountRepository } from "@/repositories/account.repository";

export class CreateNewAccountUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(userId: string, currency: CurrencyType): Promise<Account> {
    // check if the user account exist
    const existingAccount = await this.accountRepo.findByUserIdAndCurrency(
      userId,
      currency
    );
    if (existingAccount) {
      throw new Error("Account already exist");
    }

    const account = await this.accountRepo.create(userId, currency);
    return account;
  }
}
