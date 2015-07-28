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
        slug?: string;
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
