import { Logger } from '@/interfaces/Logger';
import { AccountRepository } from '@/repositories/account.repository';

export class ViewAllAccountsUseCase {
	constructor(private readonly accountRepo: AccountRepository, private readonly logger: Logger) {}

	async execute(userId: string) {
		const accounts = await this.accountRepo.findByUserId(userId);
		this.logger.info(`Found ${accounts.length} accounts for user ${userId}`);
		return accounts;
	}
}