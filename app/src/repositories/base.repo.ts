import {async, Utils, storage} from 'platypus';
import BaseFactory from '../models/base';
import CrudService from '../services/crud.svc';

export default class BaseRepository<F extends BaseFactory<any>,
    S extends CrudService<any>, M extends models.IBaseModel> {

    protected static _inject: any = {
        _Promise: async.IPromise,
        _utils: Utils,
        _cacheFactory: storage.ICacheFactory
    };

    protected _Promise: async.IPromise;
    protected _utils: Utils;
    protected _cacheFactory: storage.ICacheFactory;
    protected _cache: storage.Cache<M>;

    constructor(public Factory: F, public service: S) { }

    create(model: any, ...args: any[]): async.IThenable<number> {
        var m = this.Factory.create(model);

        return this.service.create.apply(this.service, [m].concat(args)).then((id: number) => {
            model.id = id;
            return id;
        });
    }

    all(...args: any[]): async.IThenable<Array<M>> {
        return this.service.read.apply(this.service, args)
            .then((results: Array<any>) => {
                return this.Factory.all(results);
            });
    }

    one(id: number, ...args: any[]): async.IThenable<M>;
    one(id: string, ...args: any[]): async.IThenable<M>;
    one(id: any, ...args: any[]): async.IThenable<M> {
        var idNum = Number(id);
        var haveCache = this._utils.isObject(this._cache);

        if (isNaN(idNum)) {
            return this._Promise.resolve(null);
        }

        if (haveCache) {
            var model = this._cache.read(id);

            if (this._utils.isObject(model)) {
                var m = this.Factory.create(model);
                return this._Promise.resolve(m);
            }
        }

        return this.service.read.apply(this.service, [idNum].concat(args)).then((model: any) => {
            if (haveCache) {
                this._cache.put(id, model);
            }

            return this.Factory.create(model);
        });
    }

    update(model: any, ...args: any[]): async.IThenable<M> {
        if (this._utils.isObject(this._cache)) {
            this._cache.clear();
        }

        return this.service.update.apply(this.service, [this.Factory.update(model)].concat(args)).then((val) => {
            return val;
        });
    }

    destroy(id: number, ...args: any[]): async.IThenable<void>;
    destroy(id: string, ...args: any[]): async.IThenable<void>;
    destroy(id: any, ...args: any[]): async.IThenable<void> {
        var idNum = Number(id);

        if (isNaN(idNum)) {
            return this._Promise.resolve(null);
        }

        return this.service.destroy.apply(this.service, [id].concat(args));
    }
}
