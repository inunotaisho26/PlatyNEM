/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import service = require('./base.service');

class CrudService<T extends server.IBaseModel> extends service.BaseService {
	create(data: any): plat.async.IAjaxThenable<number> {
		return this._post<number>({ data: data });		
	}
}

export = CrudService;
