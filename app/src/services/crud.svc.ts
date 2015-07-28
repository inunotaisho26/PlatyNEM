import {async, IObject} from 'platypus';
import BaseService from './base.svc';

export default class CrudService<T extends models.IBaseModel> extends BaseService {
    create(data: any, contentType?: string): async.IAjaxThenable<number> {
        return this.post<number>(undefined, {
            data: data,
            contentType: contentType || this.http.contentType.JSON
        });
    }

    all(options: services.IMultipleQuery): async.IAjaxThenable<Array<T>> {
        options = this.utils.extend({
            from: 0,
            count: 10
        }, options);

        return this.get(undefined, options);
    }

    read(uid: number | string, query?: IObject<any>): async.IAjaxThenable<T> {
        return this.get(uid, query);
    }

    update(data: any, contentType?: string): async.IAjaxThenable<void> {
        return this.put<void>(data.id, {
            contentType: contentType || this.http.contentType.JSON,
            data: data
        });
    }

    destroy(id: number | string): async.IAjaxThenable<void> {
        return this.delete<void>(id);
    }
}
