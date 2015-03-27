/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

import plat = require('platypus');
import baseFactory = require('../models/base.model');
import BaseService = require('../services/base.service');

export class BaseRepository<F extends baseFactory.BaseFactory<any>,
	S extends BaseService, M extends baseFactory.IBaseModel> {

	constructor(public Factory: F, public service: S) { }
}