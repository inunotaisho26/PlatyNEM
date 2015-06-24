declare module models {
    interface IUser {
        id?: number;
        firstname?: string;
        lastname?: string;
        email: string;
        role: string;
        hashedpassword: string;
        salt: string;
        avatar: string;
        resetPasswordToken?: string;
        resetPasswordExpires?: Date;
    }
}
