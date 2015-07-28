import Base from './base';

class Model extends Base<server.models.IPost> {
	protected validateProperties(post: server.models.IPost): server.errors.IValidationErrors {
		var validations: server.errors.IValidationErrors;

		validations = [
			this.validateTitle(post.title),
			this.validateSlug(post.slug)
		];

		return validations;
	}

	private validateTitle(title: string) {
		return this.isString(title, 'title', 'Title');
	}

	private validateSlug(slug: string) {
		return this.isString(slug, 'slug', 'Slug');
	}
}

var model = new Model();
export default model;
