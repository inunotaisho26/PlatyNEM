/// <reference path="../../../references.d.ts" />

declare module models {
    interface IPost extends IBaseModel {
        title?: string;
        content?: string;
        userid?: number;
        user?: models.IUser;
        created?: Date;
        published?: boolean;
    }
}