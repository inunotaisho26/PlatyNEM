/// <reference path="../references.d.ts" />

import express = require('express');
import utils = require('../config/utils/utils');
import PromiseStatic = require('es6-promise');
import cache = require('memory-cache');

var Promise = PromiseStatic.Promise;
var put: typeof cache.put = cache.put.bind(cache);

cache.put = (key: any, value: any, time?: number, timeoutCallback?: (key: any) => void) => {
	if (!utils.isNumber(time)) {
		time = 86400000;
	}
	return put(key, value, time, timeoutCallback);
}

class Repository<C,R,U,D> {
	utils: typeof utils = utils;
	Promise: typeof Promise = Promise;
	cache: typeof cache = cache;
	protected _caches: Array<string> = [];
	protected dontCache = false;
	protected _cachePrefix: string = '';
	private __noop: Thenable<any> = this.Promise.resolve();
	
	all(): Thenable<Array<R>> {
		return this.__noop;
	}
	
	create(obj: any): Thenable<C> {
		return this.__noop;
	}
	
	read(id: number, ...args: any[]): Thenable<R> {
		return this.__noop;
	}
	
	update(obj: any): Thenable<U> {
		return this.__noop;
	}
	
	delete(id: number): Thenable<D> {
		return this.__noop;
	}
	
	store(values: Array<any>): void;
	store(values: any): void;
	store(values: any) {
		if (!this.utils.isArray(values)) {
			values = [values];
		}
		
		this.utils.forEach(values, this._store, this);
	}
	
	protected _store(value: any) {
		if (this.dontCache) {
			return;
		}
		
		if (this.utils.isObject(value) && !this.utils.isNull(value.id)) {
			this.cache.put(this._cachePrefix + value.id, value);
		}
	}
	
	protected _clearCaches() {
		var cache: string;
		
		while(cache = this._caches.pop()) {
			this.cache.del(cache);
		}
	}
}

export = Repository;
