import {async, IObject, Utils, storage} from 'platypus';
import BaseFactory from '../models/base';
import BaseRepository from './base.repo';
import CrudService from '../services/crud.svc';

export default class CrudRepository<F extends BaseFactory<any>, S extends CrudService<any>, M extends models.IBaseModel> extends BaseRepository {
    hasCache: boolean = false;

    constructor(public Factory: F, public service: S, cache?: string) {
        super();

        if(this.utils.isString(cache)) {
            this.cache = this.cacheFactory.create<M>(cache);
            this.hasCache = true;
        }
    }

    create(model: any, ...args: any[]): async.IThenable<number> {
        var m = this.Factory.create(model);

        return this.service.create.apply(this.service, [m].concat(args)).then((id: number) => {
            model.id = id;
            return id;
        });
    }

    all(options?: services.IMultipleQuery): async.IThenable<Array<M>> {
        var key: string = 'all' + this.getQueryString(options);

        if(this.hasCache) {
            var obj = this.cache.read(key);

            if(this.utils.isArray(obj)) {
                return this.Promise.resolve(this.Factory.all(obj));
            }
        }

        return this.service.all(options)
            .then((results: Array<any>) => {
                if(this.hasCache) {
                    this.cache.put(key, results);
                }

                this.store(results);
                return this.Factory.all(results);
            });
    }

    read(uid: number | string, options?: IObject<any>): async.IThenable<M> {
        var haveCache = this.utils.isObject(this.cache);

        if (haveCache) {
            var model = this.cache.read(<string>uid);

            if (this.utils.isObject(model)) {
                var m = this.Factory.create(model);
                return this.Promise.resolve(m);
            }
        }

        return this.service.read(uid, options).then((model: any) => {
            if (haveCache) {
                this.cache.put(<string>uid, model);
            }

            return this.Factory.create(model);
        });
    }

    update(model: any): async.IThenable<void> {
        if (this.hasCache) {
            this.cache.clear();
        }

        return this.service.update(model).then((val) => {
            return val;
        });
    }

    destroy(id: number | string): async.IThenable<void> {
        var idNum = Number(id);

        if (isNaN(idNum)) {
            return this.Promise.resolve(null);
        }

        if (this.hasCache) {
            this.cache.clear();
        }

        return this.service.destroy(id);
    }

	protected store(values: Array<M>): void;
	protected store(value: M): void;
	protected store(_values: any): void {
        if(!this.hasCache) {
            return;
        }

		var values: Array<M> = _values;

		if (!this.utils.isArray(values)) {
			values = [<any>values];
		}

		this.utils.forEach(this.storeValue, values, this);
    }

    protected storeValue(value: M): void {
	   this.cache.put(<any>value.id, value);
    }
}
