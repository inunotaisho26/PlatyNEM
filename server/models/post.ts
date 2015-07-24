import Base from './base';

class Model extends Base<server.models.IPost> {
	protected validateProperties(post: models.IPost): server.errors.IValidationErrors {
		var validations: server.errors.IValidationErrors;

		validations = [
			this.validateTitle(post.title)
		];

		return validations;
	}

	private validateTitle(title: string) {
		return this.isString(title, 'title', 'Title');
	}
}

var model = new Model();
export default model;
