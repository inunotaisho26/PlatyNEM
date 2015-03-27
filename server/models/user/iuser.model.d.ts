declare module models {
    interface IUser {
        id?: number;
        firstname?: string;
        lastname?: string;
        email: string;
        role: string;
        password: string;
        salt: string;
    }
}
