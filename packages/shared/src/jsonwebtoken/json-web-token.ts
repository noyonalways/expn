import { JsonWebToken } from '@expn/core/interfaces/JsonWebToken';
import jwt from 'jsonwebtoken';

export class JsonWebTokenImpl<T> implements JsonWebToken<T> {
	sign(payload: T): Promise<string> {
		const secret = process.env.JWT_SECRET || 'very_strong_secret';
		return Promise.resolve(jwt.sign(JSON.stringify(payload), secret));
	}
	verify(token: string): Promise<T> {
		const secret = process.env.JWT_SECRET || 'very_strong_secret';
		return Promise.resolve(jwt.verify(token, secret) as T);
	}
}