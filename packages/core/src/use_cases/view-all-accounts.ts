import { AccountRepository } from '@/repositories/account.repository';

export class ViewAllAccountsUseCase {
	constructor(private readonly accountRepo: AccountRepository) {}

	async execute(userId: string) {
		const accounts = await this.accountRepo.findByUserId(userId);
		return accounts;
	}
}