/// <reference path="../../references.d.ts" />

import PromiseStatic = require('es6-promise');
import fs = require('fs');
import utils = require('./utils');

var Promise = PromiseStatic.Promise;

export var upload = (tmpPath: string, destPath: string) => {
	return new Promise<string>((resolve, reject) => {
		fs.rename(tmpPath, destPath, (err) => {
			if (err) {
				return reject(err)
			}

			resolve(destPath);
		});
	});
};

export var destroy = (file: any) => {
	if (!utils.isObject(file)) {
		return Promise.resolve(null);
	}

	return new Promise((resolve, reject) => {
		fs.unlink(file.path, (err) => {
			if (err) {
				return reject(err);
			}
			resolve(true);
		});
	});
};
