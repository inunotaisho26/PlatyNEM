export default class ValidationError implements server.errors.IValidationError {
	constructor(public message: string, public property?: string) { }
}
