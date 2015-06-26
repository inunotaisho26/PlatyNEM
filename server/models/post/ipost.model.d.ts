/// <reference path="../../references.d.ts" />

declare module models.server {
	interface IPost {
		id?: number;
		title?: string;
		content?: string;
		userid?: number;
		user?: IUser;
		created?: Date;
		published?: boolean;
	}
}
