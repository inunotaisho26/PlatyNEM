import Base from './base.proc';

export default class Procedures<R> extends Base {
	constructor(public procedure: string) {
		super(procedure);
	}

	all(options: server.procedures.IRowFilterOptions = {}): Thenable<Array<R>> {
		this.utils.defaults(options, {
			startingrow: 0,
			rowcount: 0
		});

		return this.callProcedure(`Get${this.pluralize(this.procedure)}`, options).then((result) => {
			return this.convertReturn(result);
		});
	}

	create(obj: any): Thenable<number> {
		if(!this.utils.isObject(obj)) {
			return this.Promise.resolve();
		}

		return this.callProcedure(`Insert${this.procedure}`, this.getArgs(obj)).then((result) => {
			var row = result[0] || {},
				item = this.convertReturn(row);

			return item.id;
		});
	}

	read(id: number, args: any = {}): Thenable<R> {
		this.utils.defaults(args, {
			id: id
		});

        return this.callProcedure('Get' + this.procedure, args).then((result) => {
            var row = result[0] || {};
            return this.convertReturn(row);
        });
    }

	update(obj: any): Thenable<void> {
        if (!this.utils.isObject(obj)) {
            return Promise.resolve<void>();
        }

		var args = this.getArgs(obj);

		this.utils.defaults(args, {
			id: obj.id
		});

        return this.callProcedure('Update' + this.procedure, args);
    }

    destroy(id: number): Thenable<void> {
        return this.callProcedure('Delete' + this.procedure, { id: id });
    }

	protected getArgs(obj: any): any {
		if(this.utils.isObject(obj)) {
			return obj;
		}
    }
}
