import {Utils, acquire} from 'platypus';

export default class BaseFactory<T extends models.IBaseModel> {
    utils: Utils = acquire(Utils);

    constructor(public canUpdate: boolean = false) { }

    all(data: Array<server.IBaseModel>): Array<T> {
        data = data || [];
        return data.map(this.create, this);
    }

    create(data: server.IBaseModel): T {
        if (this.utils.isObject(data)) {
            return this._instantiate(data);
        }
    }

    update(data: T): T {
        if (this.canUpdate) {
            return this.create(data);
        }

        return data;
    }

    _instantiate(data: server.IBaseModel): T {
        return <any>{
            id: data.id
        };
    }
}
