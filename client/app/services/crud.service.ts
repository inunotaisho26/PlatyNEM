/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import service = require('./base.service');

class CrudService<T extends server.IBaseModel> extends service.BaseService {
	create(data: any, contentType?: string): plat.async.IAjaxThenable<number> {
		return this._post<number>({ 
			data: data,
			contentType: contentType || this._http.contentType.JSON
		});		
	}

	read(): plat.async.IThenable<Array<T>>;
	read(...args: Array<any>): plat.async.IThenable<T>;
	read(id: number, ...args: Array<any>): plat.async.IThenable<T>;
	read(id?: any, ...args: Array<any>): plat.async.IThenable<any> {
		var params = this._utils.isNull(id) ? [] : [id];
		return this._get.apply(this, params.concat(args));
	}
}

export = CrudService;
