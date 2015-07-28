declare module server.models {
    interface IUser {
        id?: number;
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        hashedpassword: string;
        salt: string;
        avatar: string;
        resetpasswordtoken?: string;
        resetpasswordexpires?: Date;
    }

	interface IPost {
		id?: number;
		title?: string;
		content?: string;
		userid?: number;
        slug?: string;
		user?: IUser;
		created?: Date;
		published?: boolean;
	}
}
