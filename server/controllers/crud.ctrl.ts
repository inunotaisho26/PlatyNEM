import {Request, Response} from 'express';
import Base from './base.ctrl';
import Repository from '../repositories/crud.repo';
import Model from '../models/base';

export default class Controller<R extends Repository<any>, M extends Model<any>> extends Base {
    repository: R;
    model: M;

    constructor(repository: R, model?: M) {
        super();
        this.repository = repository;

        if (this.utils.isObject(model)) {
            this.model = model;
        } else {
            this.model = <M>new Model<any>();
        }
    }

    all(req: Request, res: Response): Thenable<void> {
        return this.handleResponse(this.repository.all(), res);
    }

    create(req: Request, res: Response): Thenable<void> {
        var obj = req.body;

        return this.model.validate(obj).then(() => {
            return this.handleResponse(this.repository.create(obj), res);
        },(errors) => {
            return this.handleResponse(Promise.reject(errors), res);
        });
    }

    update(req: Request, res: Response): Thenable<void> {
        var obj = req.body;

        return this.model.validate(obj).then(() => {
            return this.handleResponse(this.repository.update(obj), res);
        },(errors) => {
            return this.handleResponse(Promise.reject(errors), res);
        });
    }

    read(req: Request, res: Response): Thenable<void> {
        return this.handleResponse(this.repository.read(req.params.token), res);
    }

    destroy(req: Request, res: Response): Thenable<void> {
        var id = req.body.id;
        return this.handleResponse(this.repository.destroy(id), res);
    }
}
