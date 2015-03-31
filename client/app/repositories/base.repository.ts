/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import baseFactory = require('../models/base.model');
import service = require('../services/base.service');

class BaseRepository<F extends baseFactory.BaseFactory<any>,
	S extends service.BaseService, M extends baseFactory.IBaseModel> {

	constructor(public Factory: F, public service: S) { }
}

export = BaseRepository;
