/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import baseFactory = require('../models/base.model');
import CrudService = require('../services/crud.service');

class BaseRepository<F extends baseFactory.BaseFactory<any>,
	S extends CrudService<any>, M extends baseFactory.IBaseModel> {

	constructor(public Factory: F, public service: S) { }

	all(...args: any[]): plat.async.IThenable<Array<M>> {
		return this.service.read.apply(this.service, args)
			.then((results: Array<any>) => {
				return this.Factory.all(results);
			});
	}
}

export = BaseRepository;
