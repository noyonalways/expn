export class ApiError extends Error {
	constructor(
		public status: number,
		public message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export class NotFoundError extends ApiError {
	constructor(message = 'Resource not found') {
		super(404, message);
	}
}

export class BadRequestError extends ApiError {
	constructor(message = 'Bad request') {
		super(400, message);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message = 'Unauthorized') {
		super(401, message);
	}
}