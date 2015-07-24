import * as crypto from 'crypto';
import * as utils from 'lodash';
import * as tedious from 'tedious';
import * as pool from 'tedious-connection-pool';
import * as session from 'express-session';
import * as cache from 'memory-cache';
import {Promise} from 'es6-promise';

export default class SessionStore implements server.middleware.session.IStore {
	protected callProcedure: (procedure: string, args?: any) => Thenable<any>;
    protected table: string;
    protected procedures: server.middleware.session.IStoredProcedures;
    protected secret: string;
    protected algorithm: string;
    protected cachePrefix: string = 'session-';
    protected sessionTimeout: number = 7200;

    protected utils: typeof utils = utils;

    constructor(session: { Store: session.Store; }, options: server.middleware.session.IStoreOptions) {
        if (!this.utils.isObject(options) || !this.utils.isFunction(options.callProcedure)) {
            throw new Error('SessionStore requires options including a method to call a procedure');
        }

        this.callProcedure = options.callProcedure;
        this.table = options.table || 'sessions';
        this.secret = options.secret;
        this.algorithm = options.algorithm || 'aes-256-ctr';

        var procedures: server.middleware.session.IStoredProcedures = options.procedures || {},
            table = this.table,
            base = procedures.base ||
                table[0].toUpperCase() + table.substring(1, table.length - 1),
            tableProcedure = table[0].toUpperCase() + table.substr(1);

		this.procedures = procedures;

		this.utils.defaults(this.procedures, {
            base: base,
            insert: 'Insert' + base,
            read: 'Get' + base,
            destroy: 'Delete' + base,
            clear: 'Clear' + tableProcedure,
            length: 'Get' + tableProcedure + 'Length'
        });

        var Store = session.Store;
        (<any>SessionStore.prototype).__proto__ = (<any>Store).prototype;
        (<any>Store).call(this, options);
    }

    get(sid: string, cb: (err?: any, value?: any) => void): Thenable<any> {
        var sess = cache.get(this.cachePrefix + sid);

        if (this.utils.isObject(sess)) {
            cb(null, sess);
            return Promise.resolve<any>();
        }

        return this.callProcedure(this.procedures.read, { sid: sid }).then((result: any = []) => {
            var row = result[0] || {},
                session = row.session || {},
                json = (this.secret) ? this.decryptData(session.value) : session.value;

            if (!this.utils.isString(json)) {
                return cb();
            }

            session = !this.utils.isEmpty(json) ? JSON.parse(json) : json;
            cache.put(this.cachePrefix + sid, session, this.sessionTimeout);
            cb(null, session);
        }).then(null, (err: Error) => {
            cb(err);
        });
    }

    set(sid: string, session: any, cb: (err?: any) => void): any {
        var expires = new Date(session.cookie.expires).getTime() / 1000;
        cache.put(this.cachePrefix + sid, session, this.sessionTimeout);
        session = JSON.stringify((this.secret) ? this.encryptData(JSON.stringify(session)) : session);

        return this.callProcedure(this.procedures.insert, {
            sid: sid,
            session: session,
            expires: expires
        }).then(() => {
            cb();
        },(err: Error) => {
            cb(err);
        });
    }

    destroy(sid: string, cb: (err?: any) => void): Thenable<void> {
        cache.del(this.cachePrefix + sid);
        return this.callProcedure(this.procedures.destroy, { sid: sid }).then(() => {
            cb();
        },(err: Error) => {
            cb(err);
        });
    }

    length(cb: (err: any, length?: number) => void): Thenable<void> {
        return this.callProcedure(this.procedures.length).then((result) => {
            var row = result[0] || {},
                length = row.length || {};
            cb(null, length.value);
        },(err: Error) => {
            cb(err);
        });
    }

    clear(cb: (err?: any) => void): Thenable<void> {
        this.utils.forEach(cache.keys,(key: string) => {
            if (key.indexOf(this.cachePrefix) === 0) {
                cache.del(key);
            }
        });

        return this.callProcedure(this.procedures.clear).then(() => {
            cb();
        },(err: Error) => {
            cb(err);
        });
    }

    private encryptData(text: string): server.middleware.session.ICipher {
        if (!this.utils.isString(text)) {
            text = '';
        }

        var cipherText = this.encrypt(text),
            hmacText = this.digest(cipherText);

        return {
            ct: cipherText,
            mac: hmacText
        };
    }

    private decryptData(json: string): string {
        if (!this.utils.isString(json)) {
            return json;
        }

        var cipher: server.middleware.session.ICipher = JSON.parse(json),
            hmac = this.digest(cipher.ct);

        if (hmac !== cipher.mac) {
            throw 'Encrypted session does not match the stored session';
        }

        return this.decrypt(cipher.ct);
    }

    private digest(obj: any): string {
        var key = this.secret,
            hmac = crypto.createHmac('sha512', key);

        hmac.update(obj, 'hex');
        return hmac.digest('hex').toString();
    }

    private encrypt(text: string): string;
    private encrypt(text: Buffer): string;
    private encrypt(text: any): string {
        var key = this.secret,
            buffer: Buffer = (Buffer.isBuffer(text)) ? text : new Buffer(text);

        var cipher = crypto.createCipher(this.algorithm, key),
            cipherText: Array<any> = [];

        cipherText.push((<any>cipher).update(buffer, 'buffer', 'hex'));
        cipherText.push(cipher.final('hex'));

        return cipherText.join('');
    }

    private decrypt(cipherText: string): string {
        var key = this.secret,
            cipher = crypto.createDecipher(this.algorithm, key),
            pt: Array<any> = [];

        pt.push(cipher.update(cipherText, 'hex', 'utf8'));
        pt.push(cipher.final('utf8'));

        return pt.join('');
    }
}
