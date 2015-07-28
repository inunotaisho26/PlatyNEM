import {async} from 'platypus';
import BaseService from './base.svc';

export default class CrudService<T extends models.IBaseModel> extends BaseService {
    create(data: any, contentType?: string): plat.async.IAjaxThenable<number> {
        return this.post<number>(undefined, {
            data: data,
            contentType: contentType || this.http.contentType.JSON
        });
    }

    all(options: services.IMultipleQuery): plat.async.IThenable<Array<T>> {
        options = this.utils.extend({
            from: 0,
            count: 10
        }, options);

        return this.get(undefined, options);
    }


    read(uid: number | string, query?: plat.IObject<any>): plat.async.IThenable<T> {
        return this.get(uid, query);
    }

    update(data: any, contentType?: string): plat.async.IThenable<T> {
        return this.put<T>(data.id, {
            contentType: contentType || this.http.contentType.JSON,
            data: data
        });
    }

    destroy(id: number | string): plat.async.IThenable<void> {
        return this.delete<void>(id);
    }
}
