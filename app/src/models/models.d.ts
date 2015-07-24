declare module models {
	interface IBaseModel {
	    id?: number;
	}

	interface IAlert {
		property?: string;
		message: string;
	}

    interface IPost extends IBaseModel {
        title?: string;
        content?: string;
        userid?: number;
        user?: models.IUser;
        created?: Date;
        published?: boolean;
    }

    interface IUser extends IBaseModel {
	    firstname: string;
	    lastname: string;
	    email: string;
	    avatar?: string;
	    role?: string;
	}
}

declare module ajax {
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

    export interface IFormattedResponse {
        status: number;
        body: IResponseBody;
    }
}
