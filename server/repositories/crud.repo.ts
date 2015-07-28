import Base from './base.repo';
import Procedures from '../procedures/crud.proc';

export default class Repository<R> extends Base {
	constructor(public procedures: Procedures<R>) {
		super(procedures);
	}

	all(startingrow?: number, rowcount?: number, args?: any | Array<{}>): Thenable<Array<R>> {
		var prefix = this.cachePrefix + `-all-startingrow-${startingrow}-rowcount-${rowcount}-args-${this.utils.map(args, (arg, key) => { return key + '-' + arg; })}`,
			cached = this.fetch(prefix);

		if(this.utils.isObject(cached)) {
			return this.Promise.resolve(cached);
		}

		return this.procedures.all(startingrow, rowcount, args).then((values) => {
			this.storeById(values);
			this.store(prefix, values);
			return values;
		});
	}

	create(obj: any): Thenable<number> {
		this.clearCaches();
		return this.procedures.create(obj).then((value) => {
			obj.id = value;
			this.storeById(obj);
			return value;
		});
	}

	read(id: number, args?: any | Array<{}>): Thenable<R> {
		var cached: R,
			prefix: string;

		if(this.utils.isObject(args)) {
			prefix = this.cachePrefix + this.utils.keys(args).join('-');
			cached = this.cache.get(prefix);
		} else {
			cached = this.fetch(id);
		}

		if(this.utils.isObject(cached)) {
			return this.Promise.resolve(cached);
		}

		return this.procedures.read(id, args).then((value) => {
			if(this.utils.isString(prefix)) {
				this.store(prefix, value);
			} else {
				this.storeById(value);
			}

			return value;
		});
	}

	update(obj: any): Thenable<void> {
		var cached: R = this.fetch(obj.id);
		this.clearCaches();

		return this.procedures.update(obj).then(() => {
			if(this.utils.isObject(cached)) {
				this.utils.defaults(obj, cached);
			}

			this.storeById(obj);
		});
	}

	destroy(id: number): Thenable<void> {
		this.clearCaches();
		this.cache.del(this.cachePrefix + id);
		return this.procedures.destroy(id);
	}
}
