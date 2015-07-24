import * as utils from 'lodash';
import {Promise} from 'es6-promise';
import {convertReturn, procedure, query} from '../config/db';
import ValidationError from '../errors/validation.err';
import {pluralize} from '../utils/utils';

export default class Procedures {
	protected Promise: typeof Promise = Promise;
	protected utils: typeof utils = utils;
	protected ValidationError: typeof ValidationError = ValidationError;

	static query(sql: string): Thenable<Array<any>> {
		return query(sql);
	}

	static procedure(proc: string, args?: any): Thenable<any> {
		return procedure(proc, args);
	}

	constructor(public procedure: string) { }

	protected convertReturn(value: any): any {
        if(!this.utils.isObject(value)) {
            return;
        }

		return convertReturn(value);
	}

    protected pluralize(value: string): string {
		return pluralize(value);
	}

	protected callProcedure(proc: string, args?: any): Thenable<any> {
		return Procedures.procedure(proc, args);
	}

	protected query(sql: string): Thenable<Array<any>> {
		return Procedures.query(sql);
	}
}
