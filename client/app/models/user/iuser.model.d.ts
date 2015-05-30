/// <reference path="../../../references.d.ts" />

declare module models {
	interface IUser extends models.IBaseModel {
	    firstname: string;
	    lastname: string;
	    email: string;
	    avatar?: string;
	    role?: string;
	}
}