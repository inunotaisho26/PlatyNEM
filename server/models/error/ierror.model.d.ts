declare module models {
    export interface IValidationError {
        message: string;
        property: string;
    }

    export interface IValidationErrors extends Array<IValidationError> { }
} 