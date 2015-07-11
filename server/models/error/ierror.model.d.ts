declare module models.server {
    export interface IValidationError {
        message: string;
        property: string;
    }

    export interface IValidationErrors extends Array<IValidationError> { }
}