import * as tds from 'tedious';
import * as Pool from 'tedious-connection-pool';
import {Promise} from 'es6-promise';
import {isArray, isBoolean, isUndefined, isDate, isNull, isNumber, isObject, isString, extend, forEach} from 'lodash';
import {db} from './global';

export var pool = new Pool({
	min: db.minConnectionLimit,
	max: db.maxConnectionLimit,
	acquireTimeout: db.connectTimeout
}, {
	server: db.host,
	userName: db.user,
	password: db.password,
	options: {
		database: db.database,
		port: db.port,
		encrypt: db.encrypt,
		connectTimeout: db.connectTimeout,

		// will use column names as keys of an Object instead of an Array
		useColumnNames: true,

		// will collect rows on done, doneInProc, and doneProc events
		rowCollectionOnDone: true
	}
});

function connection(): Thenable<Pool.PooledConnection> {
	return 	new Promise((resolve, reject) => {
		pool.acquire((err, connection) => {
			if(isObject(err)) {
				return reject(err);
			}

			resolve(connection);
		});
	});
};

function queryRequest(sql: string, connection: Pool.PooledConnection): Thenable<Array<any>> {
	return new Promise((resolve, reject) => {
		var request = new tds.Request(sql, (error) => {
            connection.release();

            if (error) {
                reject(error);
            }
        });

        request.on('done', (rowCount: number, more: boolean, rows?: Array<any>) => {
            if (!more) {
                // must set rowCollectionOnDone to true in connection.ts for this to work correctly
                // resolve(rows);
                resolve(rowCount);
            }
        });

        connection.execSql(request);
	});
}

function procRequest(proc: string, args: any, connection: Pool.PooledConnection): Thenable<Array<Array<any>>> {
	return new Promise((resolve, reject) => {
        var returnRows: Array<Array<any>> = [],
            request = new tds.Request(proc, (error) => {
                connection.release();

                if (isObject(error)) {
                    reject(error);
                    return;
                }

                resolve(convertReturn(returnRows));
            });

        addArguments(request, args);

        request.on('doneInProc', (rowCount: number, more: boolean, rows: Array<any>) => {
            returnRows.push(rows);
        });

        connection.callProcedure(request);
	});
}

function addArguments(request: tds.Request, args: any): void {
	if (!isObject(args)) {
        return;
    } else if(isArray(args)) {
        return forEach(args, (value) => {
            addArguments(request, value);
        });
    }

    var keys = Object.keys(args),
        length = keys.length,
        key: string,
        value: any;

    for (var i = 0; i < length; ++i) {
        key = keys[i];
        value = args[key];
        if (!(isNull(value) || isUndefined(value))) {
            request.addParameter(key, convertType(value), value);
        }
    }
}

function convertType(value: any): tds.TediousType {
    if (isNull(value)) {
        return tds.TYPES.Null;
    } else if (isBoolean(value)) {
        return tds.TYPES.Bit;
    } else if (isNumber(value)) {
        return tds.TYPES.Int;
    } else if (isString(value)) {
        return tds.TYPES.NVarChar;
    } else if (isDate(value)) {
        return tds.TYPES.DateTime2N;
    } else {
        throw new Error('Invalid data type.');
    }
}

export var convertReturn = (value: any): any => {
    if (!isObject(value)) {
        return value;
    } else if (isArray(value)) {
        var l = value.length,
            returnArray = <Array<any>>[];

        for (let i = 0; i < l; ++i) {
            returnArray.push(convertReturn(value[i]));
        }

        return returnArray;
    }

    var keys = Object.keys(value),
        length = keys.length,
        key: string,
        args: { value: any; metadata: any },
        ret = <any>{};

    for (let i = 0; i < length; ++i) {
        key = keys[i];
        args = value[key];
        ret[key] = args.value;
    }

    return ret;
};

export var query = (sql: string): Thenable<Array<any>> => {
	return connection().then((connection) => {
		return queryRequest(sql, connection);
	});
};

export var procedure = (procedure: string, args?: any): Thenable<Array<Array<any>>> => {
	return connection().then((connection) => {
		return procRequest(procedure, args, connection);
	});
};

function clean(): Thenable<any> {
    return procedure('CleanSessions').then(() => {
        return 'Sessions cleaned!';
    }, (err) => {
        return err;
    }).then(console.log.bind(console));
}

var configure = (): void => {
    // Clean Sessions immediately and every 24 hours
    setInterval(clean, 1000 * 60 * 60 * 24);
    clean();

};

pool.on('error', (err: any) => {
	console.log(err);
});

export default configure;
