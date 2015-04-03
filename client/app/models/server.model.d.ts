declare module server {
    export interface IBaseModel {
        id?: number;
    }

    export interface IUser extends IBaseModel {
        firstname: string;
        lastname: string;
        email: string;
        avatar: string;
    }

    export interface IPost extends IBaseModel {
        title?: string;
        content?: string;
        userid?: number;
        user?: IUser;
        created?: Date;
        published?: number;
        lastupdated?: Date;
    }

    export module ajax {
        export interface IValidationError {
            message: string;
            property?: string;
        }

        export interface IValidationErrors extends Array<IValidationError> { }

        export interface IResponseBody {
            status: string;
            data?: any;
            message?: string;
        }
    }
}