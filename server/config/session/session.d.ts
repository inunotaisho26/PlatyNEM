declare module models.session {
    export interface IStore {
        on? (event: string, cb: (...args: any[]) => void): void;
        emit? (event: string): void;
    }

    export interface IStoreOptions {
        pool: any;
        table?: string;
        procedures?: IStoreProcedures;
        secret?: string;
        algorithm?: string;
    }

    export interface IStoreProcedures {
        base?: string;
        insert?: string;
        read?: string;
        length?: string;
        clear?: string;
        destroy?: string;
    }

    export interface ICipher {
        ct: string;
        mac: string;
    }
}