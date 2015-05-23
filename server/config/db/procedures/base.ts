/// <reference path="../../../references.d.ts" />

import ValidationError = require('../../../models/error/error.model');
import utils = require('../../utils/utils');
import PromiseStatic = require('es6-promise');
import pool = require('../pool');

var Promise = PromiseStatic.Promise;

class Procedures<C, R, U, D> {
    utils: typeof utils = utils;
    Promise: typeof Promise = Promise;
    ValidationError: typeof ValidationError = ValidationError;

    constructor(public procedure: string) { }

    static query(sql: string): Thenable<any>;
    static query(sql: string, values?: Array<any>): Thenable<any>;
    static query(sql: string, values?: Array<any>): Thenable<any> {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (utils.isObject(err)) {
                    return reject(err);
                } else if (utils.isArray(values)) {
                    sql = connection.format(sql, values);
                    console.log(sql);
                }

                connection.query(sql, (err: any, response: Array<any>) => {
                    connection.release();
                    if (utils.isObject(err)) {
                        console.log(err);
                        return reject(err);
                    }

                    if (utils.isArray(response)) {
                        response.pop();
                    }

                    resolve(response);
                });
            })
        });
    }

    static formatArguments(array: Array<any>) {
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

    static callProcedure(procedure: string, args: Array<any> = []): Thenable<any> {
        return Procedures.query('CALL ' + procedure + Procedures.formatArguments(args), args);
    }

    callProcedure(procedure: string, args: Array<any> = []): Thenable<any> {
        return Procedures.callProcedure(procedure, args);
    }

    getArgs(obj: any): Array<any> {
        console.log('Should be implementing getArgs for procedure: ' + this.procedure);
        return [];
    }

    all(): Thenable<Array<R>> {
        return this.callProcedure('Get' + this._getAllProcedure(this.procedure), [0,0])
            .then((results) => {
                return results[0];
            });
    }

    create(obj: any): Thenable<C> {
        if (!utils.isObject(obj)) {
            return Promise.resolve(null);
        }
        return this.callProcedure('Insert' + this.procedure, this.getArgs(obj)).then((results: Array<Array<any>>) => {
            obj.id = results[0][0].id;
            return obj.id;
        });
    }

    update(obj: any): Thenable<U> {
        if (!utils.isObject(obj)) {
            return Promise.resolve(null);
        }

        return this.callProcedure('Update' + this.procedure, [obj.id].concat(this.getArgs(obj)))
            .then((values: Array<U>) => {
                return values[1];
            })
    }

    read(id: number, ...args: any[]): Thenable<R> {
        return this._read.apply(this, !!id ? [id].concat(args) : args).then((results: Array<Array<any>>) => {
            return results[0][0];
        });
    }
    
    destroy(id: number): Thenable<D> {
        return this.callProcedure('Delete' + this.procedure, [id]).then((rows: Array<any>) => {
            return rows[0]; 
        });
    }

    protected _read(id: number, ...args: any[]): Thenable<Array<Array<any>>> {
        return this.callProcedure('Get' + this.procedure, [id].concat(args));
    }

    protected _getAllProcedure(procedure: string) {
        var last = procedure.slice(-2);
        
        if (last[1] === 'y') {
            return procedure.slice(0, -1) + 'ies';
        } else if (/(?:.[s|z|x]|ch|sh)$/.test(last)) {
            return procedure + 'es';
        }
        
        return procedure + 's';
    }
}

export = Procedures;
