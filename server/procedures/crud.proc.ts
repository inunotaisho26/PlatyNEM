import Base from './base.proc';

export default class Procedures<R> extends Base {
	constructor(public procedure: string) {
		super(procedure);
	}

	all(startingrow: number = 0, rowcount: number = 10, args: any | Array<{}> = []): Thenable<Array<R>> {
		args.push({
            startingrow: startingrow
        }, {
            rowcount: rowcount
        });

		return this.callProcedure(`Get${this.pluralize(this.procedure)}`, args).then((result) => {
			return result[0];
		});
	}

	create(obj: any): Thenable<number> {
		if(!this.utils.isObject(obj)) {
			return this.Promise.resolve();
		}

		return this.callProcedure(`Insert${this.procedure}`, this.getArgs(obj)).then((result) => {
			var rows = result[0] || [],
				item = rows[0] || {};

			return item.id;
		});
	}

	read(id: number | string, args: any | Array<{}> = []): Thenable<R> {
        if(this.utils.isNumber(id) || this.utils.isString(id)) {
            args.push({
                id: id
            });
        }

        return this.callProcedure('Get' + this.procedure, args).then((result) => {
            var rows = result[0] || [];
            return rows[0];
        });
    }

	update(obj: any): Thenable<void> {
        if (!this.utils.isObject(obj)) {
            return Promise.resolve<void>();
        }

		var args = this.getArgs(obj);

        if(this.utils.isArray(args)) {
            args.push({ id: obj.id });
        } else {
    		this.utils.defaults(args, {
    			id: obj.id
    		});
        }

        return this.callProcedure('Update' + this.procedure, args).then(this.utils.noop);
    }

    destroy(id: number): Thenable<void> {
        return this.callProcedure('Delete' + this.procedure, [
            { id: id }
        ]).then(this.utils.noop);
    }

	protected getArgs(obj: any): Array<{}> {
		if(this.utils.isObject(obj)) {
			return [obj];
		}
    }
}
