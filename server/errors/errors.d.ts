declare module server.errors {
	interface IError {
		message: string;
	}

	interface IValidationError extends IError {
		property: string;
	}

	interface IValidationErrors extends Array<IValidationError> {}
}
