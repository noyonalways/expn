import { ApiResponse } from '@/types';
import { ApiError, NotFoundError, UnauthorizedError } from './errors';
import { Account } from '@expn/core/entities/account.entity';
import { Currency } from '@expn/core/entities/account.entity';
import { Transaction } from '@expn/core/entities/transaction.entity';

interface RequestConfig<TRequest> {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	endpoint: string;
	data?: TRequest;
	params?: Record<string, string | number>;
}

export class ExpnClient {
	private baseURL: string;
	private apiKey: string;

	constructor(baseURL: string, apiKey: string) {
		this.baseURL = baseURL.replace(/\/$/, '');
		this.apiKey = apiKey;
	}

	private async request<TRquest, TResponse>(config: RequestConfig<TRquest>) {
		const { method, endpoint, data, params } = config;
		const url = new URL(`${this.baseURL}${endpoint}`);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value.toString());
			});
		}

		const headers = {
			'Content-Type': 'application/json',
			'X-API-Key': this.apiKey,
		};

		const options: RequestInit = {
			method,
			headers,
			body: data ? JSON.stringify(data) : undefined,
		};

		try {
			const response = await fetch(url.toString(), options);
			if (!response.ok) {
				this.handleError(response);
			}
			const responseData = (await response.json()) as TResponse;
			const result: ApiResponse<TResponse> = {
				data: responseData,
				status: response.status,
			};
			return result;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError(500, 'Network error');
		}
	}

	private async handleError(response: Response) {
		const { status } = response;
		let message = 'An error occurred';

		try {
			const errorData = await response.json();
			message = errorData.message || message;
		} catch {
			// No JSON response
		}

		switch (status) {
			case 401:
				throw new UnauthorizedError(message);
			case 404:
				throw new NotFoundError(message);
			default:
				throw new ApiError(status, message);
		}
	}

	// User Registration
	async register(name: string, email: string, password: string) {
		return this.request<
			{ name: string; email: string; password: string },
			{ token: string }
		>({
			method: 'POST',
			endpoint: '/auth/register',
			data: { name, email, password },
		});
	}

	// User Login
	async login(email: string, password: string) {
		return this.request<{ email: string; password: string }, { token: string }>(
			{
				method: 'POST',
				endpoint: '/auth/login',
				data: { email, password },
			}
		);
	}

	// create account
	async createAccount(userId: string, currency: Currency) {
		return this.request<{ userId: string; currency: Currency }, Account[]>({
			method: 'POST',
			endpoint: '/accounts',
			data: { userId, currency },
		});
	}

	// get account
	async getAccounts(userId: string) {
		return this.request<{ userId: string }, Account[]>({
			method: 'GET',
			endpoint: `/accounts/${userId}`,
		});
	}

	// add income
	async addIncome(accountId: string, amount: number) {
		return this.request<{ accountId: string; amount: number }, Transaction>({
			method: 'POST',
			endpoint: '/transactions/income',
			data: { accountId, amount },
		});
	}

	// add expense
	async addExpense(accountId: string, amount: number) {
		return this.request<{ accountId: string; amount: number }, Transaction>({
			method: 'POST',
			endpoint: '/transactions/expense',
			data: { accountId, amount },
		});
	}
}