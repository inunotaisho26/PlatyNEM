import * as express from 'express';
import * as cache from 'memory-cache';
import * as utils from 'lodash';
import {Promise} from 'es6-promise';
import Procedures from '../procedures/base.proc';

var put = cache.put.bind(cache);
cache.put = (key: any, value: any, time?: number, timeoutCallback?: (key: any) => void) => {
    if (!utils.isNumber(time)) {
        // 1 day
        time = 86400000;
    }
    return put(key, value, time, timeoutCallback);
};

export default class Repository {
    utils: typeof utils = utils;
    Promise: typeof Promise = Promise;
    cache: typeof cache = cache;
    protected caches: Array<string> = [];
    protected listCaches: Array<string> = [];
    protected useCache: boolean = true;
    protected cachePrefix: string = '';

	constructor(protected procedures: Procedures) { }

    protected fetch(id: number): any
    protected fetch(prefix: string): any
    protected fetch(id: any): any {
        if(!this.useCache) {
            return;
        }

        var isString = this.utils.isString(id),
            isNumber = this.utils.isNumber(id) || (isString && !isNaN(Number(id))),
            prefix: string = <string>id;

        if(isNumber) {
            prefix = this.cachePrefix + id;
        }

        var cached = this.cache.get(prefix);

        if(this.utils.isObject(cached)) {
            this.cache.put(prefix, cached);
        }

        return cached;
    }

    protected store(prefix: any, value: any): void {
        if(!this.useCache) {
            return;
        }

        this.cache.put(prefix, value);
        this.caches.push(prefix);
    }

	protected storeById(values: Array<any>): void;
    protected storeById(values: any): void;
    protected storeById(values: any): void {
        if (!this.utils.isArray(values)) {
            values = [values];
        }

        this.utils.forEach(values, this.storeItemById, this);
    }

	protected storeItemById(value: any): void {
        if (!this.useCache) {
            return;
        }

        var prefix = this.cachePrefix + value.id;

        if (this.utils.isObject(value) && !this.utils.isNull(value.id)) {
            this.cache.put(prefix, value);
        }
    }

	protected clearCaches(): void {
        var cache: string;

        while (cache = this.caches.pop()) {
            this.cache.del(cache);
        }
    }
}
