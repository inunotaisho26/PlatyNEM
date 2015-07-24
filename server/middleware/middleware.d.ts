declare module server.middleware {
	module session {
	    interface IStore {
	        on? (event: string, cb: (...args: any[]) => void): void;
	        emit? (event: string): void;
	    }

	    interface IStoreOptions {
	        callProcedure: (procedure: string, args?: any) => Thenable<any>;
	        table?: string;
	        procedures?: IStoredProcedures;
	        secret?: string;
	        algorithm?: string;
	    }

	    interface IStoredProcedures {
	        base?: string;
	        insert?: string;
	        read?: string;
	        length?: string;
	        clear?: string;
	        destroy?: string;
	    }

	    interface ICipher {
	        ct: string;
	        mac: string;
	    }
	}
}
