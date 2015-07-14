/// <reference path="../../references.d.ts" />

import Base = require('../base.model');

class Model extends Base<models.IPost> {
	validateProperties(post: models.IPost): models.server.IValidationErrors {
		var validations: models.server.IValidationErrors;

		validations = [
			this.validateTitle(post.title)
		];

		return validations;
	}

	validateTitle(title: string) {
		return this.isString(title, 'title', 'Title');
	}
}

var model = new Model();
export = model;
