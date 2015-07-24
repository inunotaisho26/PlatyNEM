declare module server.config {
	interface IConfig {
        app: IAppConfig;
        db: IDatabaseConfig;
        environment: IEnvironmentConfig;
        port: number;
        root: string;
        secret: string;
        smtp: ISmtpConfig;
	}

    interface IAppConfig {
        name: string;
        url: string;
        dist: string;
        uploads: string;
    }

    interface IDatabaseConfig {
        host: string;
        user: string;
        password: string;
        database: string;
        port: number;
        connectTimeout: number;
        minConnectionLimit: number;
        maxConnectionLimit: number;
        encrypt: boolean;
    }

    interface ISmtpConfig {
        service: string;
        username: string;
        password: string;
    }

    interface IEnvironmentConfig {
        prod: boolean;
        dev: boolean;
        test: boolean;
    }
}
