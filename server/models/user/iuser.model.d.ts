declare module models.server {
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
}
