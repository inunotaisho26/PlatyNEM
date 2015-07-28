declare module services {
    interface IHttpConfig {
        url?: string;
        method?: string;
        contentType?: string;
    }

    interface IMultipleQuery extends plat.IObject<any> {
        from?: number;
        count?: number;
    }

    interface IPublishedQuery extends IMultipleQuery {
        published?: boolean;
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
