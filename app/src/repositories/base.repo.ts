import {async, IObject, Utils, storage} from 'platypus';
import BaseFactory from '../models/base';
import CrudService from '../services/crud.svc';

export default class BaseRepository {
    protected static _inject: any = {
        Promise: async.IPromise,
        utils: Utils,
        cacheFactory: storage.ICacheFactory
    };

    protected Promise: async.IPromise;
    protected utils: Utils;
    protected cacheFactory: storage.ICacheFactory;
    protected cache: storage.Cache<any>;

    protected getQueryString(query: IObject<any> = {}): string {
        return '?' + this.utils.map((value, key) => {
            return `${key}=${value}`;
        }, query).join('&');
    }
}
