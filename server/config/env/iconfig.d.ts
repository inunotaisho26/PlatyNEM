declare module models {
	interface IConfig {
		app: IAppConfig;
		db: IDbConfig;
		smtp: ISmtpConfig;
		sessionKey: string;
		port: number;
		root: string;
	}
	
	interface IAppConfig {
		name: string;
		url: string;
		dist: string;
		uploads: string;
	}
	
	interface IDbConfig {
		host: string;
		user: string;
		password: string;
		dbName: string;
		connectionLimit: number;
	}
	
	interface ISmtpConfig {
		service: string;
		username: string;
		password: string;
	}
}