declare module server.models {
    interface IUser {
        id?: number;
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        createdFrom: string;
        provider: string;
        facebookid: string;
        hashedpassword: string;
        salt: string;
        avatar: string;
        resetPasswordToken?: string;
        resetPasswordExpires?: Date;
    }

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
