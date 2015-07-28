import {Request, Response, Router} from 'express';
import Base from './crud.ctrl';
import repository from '../repositories/post.repo';
import model from '../models/post';

class Controller extends Base<typeof repository, typeof model> {
	initialize(baseRoute: string, router: Router): void {
		router.get(baseRoute, this.all.bind(this))
			.get(baseRoute + '/:token', this.read.bind(this))
			.put(baseRoute + '/:id', this.auth.isAdmin, this.update.bind(this))
			.delete(baseRoute + '/:id', this.auth.isAdmin, this.destroy.bind(this))
			.post(baseRoute, this.auth.requiresLogin, this.auth.isAdmin, this.create.bind(this));
	}

	all(req: Request, res: Response): Thenable<void> {
		var published: boolean = null;

		if (req.query.published === 'true') {
			published = true;
		}

		return this.handleResponse(this.repository.all(req.query.from, req.query.count, published), res);
	}

	create(req: Request, res: Response): Thenable<void> {
		var post: server.models.IPost = req.body;

		post.created = post.created || new Date();
		return super.create(req, res);
	}

	destroy(req: Request, res: Response): Thenable<void> {
		req.body.id = req.params.id;
		return super.destroy(req, res);
	}
}
var controller = new Controller(repository, model);
export default controller;
