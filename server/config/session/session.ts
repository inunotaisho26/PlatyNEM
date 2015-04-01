/// <reference path="../../references.d.ts" />

import crypto = require('crypto');
import utils = require('../utils/utils');
import PromiseStatic = require('es6-promise');
import mysql = require('mysql');
import session = require('express-session');

var Promise = PromiseStatic.Promise;

class SessionStore implements models.session.IStore, models.session.IStoreOptions {
	pool: mysql.IPool;
	table: string;
	procedures: models.session.IStoreProcedures;
	secret: string;
	algorithm: string;

	constructor(session: { Store: session.Store; }, options: models.session.IStoreOptions) {
	    if (!utils.isObject(options) || !utils.isObject(options.pool)) {
	    	throw new Error('SessionStore requires options including a MySQL connection pool.');
	    }

	    this.pool = options.pool;
	    this.table = options.table || 'sessions';
	    this.secret = options.secret;
	    this.algorithm = options.algorithm;

	    var procedures: models.session.IStoreProcedures = options.procedures || {};
	    var base = procedures.base ||
	    	this.table[0].toUpperCase() + this.table.substring(1, this.table.length - 1);
	    var tableProcedure = this.table[0].toUpperCase() + this.table.substr(1);

	    this.procedures = utils.extend({
	    	base: base,
	    	insert: 'Insert' + base,
	    	read: 'Get' + base,
	    	destroy: 'Delete' + base,
	    	clear: 'Clear' + base,
	    	length: 'Get' + tableProcedure + 'Length'
	    }, procedures);

	    var Store = session.Store;
	    (<any>SessionStore.prototype).__proto__ = (<any>Store).prototype;
	    (<any>Store).call(this, options);
	}

	get(sid: string, cb: (err?: any, value?: any) => void) {
        return this.call(this.procedures.read, [sid]).then((result: any) => {
            var row = result[0][0] || {},
                session = row.session,
                json = (this.secret) ? this.decryptData(session) : session;
            if (!utils.isString(json)) {
                return cb();
            }

            cb(null, !utils.isEmpty(json) ? JSON.parse(json) : json);
        }).then(null, (err: Error) => {
            cb(err);
        });
    }

    set(sid: string, session: any, cb: (err?: any) => void): any {
        var expires = new Date(session.cookie.expires).getTime() / 1000;

        session = JSON.stringify((this.secret) ? this.encryptData(JSON.stringify(session)) : session);
        
        return this.call(this.procedures.insert, [sid, session, expires]).then(() => {
            cb();
        }, (err: Error) => {
            cb(err);
        });
    }

    destroy(sid: string, cb: (err?: any) => void) {
        return this.call(this.procedures.destroy, [sid]).then(() => {
            cb();
        },(err: Error) => {
            cb(err);
        });
    }

    length(cb: (err?: any) => void) {
        return this.call(this.procedures.length).then(() => {
            cb();
        },(err: Error) => {
            cb(err);
        });
    }

    clear(cb: (err?: any) => void) {
        return this.call(this.procedures.clear).then(() => {
            cb();
        },(err: Error) => {
            cb(err);
        });
    }

    private query(sql: string): Thenable<any>;
    private query(sql: string, values?: Array<any>): Thenable<any>;
    private query(sql: string, values?: Array<any>): Thenable<any> {
        return new Promise((resolve: (value: Array<any>) => void, reject: (err: Error) => void) => {
            this.pool.getConnection((err, connection) => {
                if (utils.isObject(err)) {
                    return reject(err);
                } else if (utils.isArray(values)) {
                    sql = connection.format(sql, values);
                }

                connection.query(sql, (err: any, response: Array<any>) => {
                    connection.release();
                    if (utils.isObject(err)) {
                        return reject(err);
                    }

                    if (utils.isArray(response)) {
                        response.pop();
                    }

                    resolve(response);
                });
            });
        });
    }

    private formatArguments(array: Array<any>) {
        if (!utils.isArray(array) || array.length === 0) {
            return '();';
        }

        var sql = '(';

        for (var i = 0, length = array.length - 1; i < length; ++i) {
            sql += '?, ';
        }

        sql += '?);';

        return sql;
    }

    private call(procedure: string, args: Array<any> = []): Thenable<any> {
        return this.query('CALL ' + procedure + this.formatArguments(args), args);
    }

    private encryptData(text: string): models.session.ICipher {
        if (!utils.isString(text)) {
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
        if (!utils.isString(json)) {
            return json;
        }

        var cipher: models.session.ICipher = JSON.parse(json),
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
            algo = this.algorithm || 'aes-256-ctr',
            buffer: Buffer = (Buffer.isBuffer(text)) ? text : new Buffer(text);

        var cipher = crypto.createCipher(algo, key),
            cipherText: Array<any> = [];

        cipherText.push((<any>cipher).update(buffer, 'buffer', 'hex'));
        cipherText.push(cipher.final('hex'));

        return cipherText.join('');
    }

    private decrypt(cipherText: string): string {
        var key = this.secret,
            algo = this.algorithm || 'aes-256-ctr',
            cipher = crypto.createDecipher(algo, key),
            pt: Array<any> = [];

        pt.push(cipher.update(cipherText, 'hex', 'utf8'));
        pt.push(cipher.final('utf8'));

        return pt.join('');
    }
}

export = SessionStore;
