import {async, debug, IObject, register, Utils} from 'platypus';

export default class BaseService {
    protected static _inject: any = {
        http: async.Http,
        utils: Utils,
        Promise: async.IPromise,
        log: debug.Log
    };

    protected utils: Utils;
    protected http: async.Http;
    protected Promise: async.IPromise;
    protected log: debug.Log;

    baseRoute: string;

    constructor(baseRoute: string = '') {
        this.baseRoute = 'api/' + this.trimSlashes(baseRoute);
    }

    protected get<T>(url: number | string = '', query?: IObject<any>, options?: services.IHttpConfig): async.IAjaxThenable<T> {
        return this.json(url + this.getQueryString(query), <any>options);
    }

    protected post<T>(url: number | string = '', options: services.IHttpConfig = {}): async.IAjaxThenable<T> {
        return this.json(url, this.utils.extend(options, {
            method: 'POST'
        }));
    }

    protected put<T>(url: number | string = '', options: services.IHttpConfig = {}): async.IAjaxThenable<T> {
        return this.json(url, this.utils.extend(options, {
            method: 'PUT'
        }));
    }

    protected delete<T>(url: number | string = '', options: services.IHttpConfig = {}): async.IAjaxThenable<T> {
        return this.json(url, this.utils.extend(options, {
            method: 'DELETE'
        }));
    }

    protected json<T>(url: number | string = '', options: async.IHttpConfig = { url: '', method: 'GET' }): async.IAjaxThenable<T> {
        options = this.utils.extend(options, {
            url: this.normalizeUrl(url)
        });

        return this.http.json<ajax.IResponseBody>(options).then((result) => {
            return result.response.data;
        }, (result) => {
            this.handleError(result.response);
        });
    }

    protected normalizeUrl(value: number | string): string {
        if(this.utils.isString(value) && (<string>value).indexOf('://') > -1) {
            return <string>value;
        }

        var url = this.baseRoute;

        if(this.utils.isNull(value)) {
            return url;
        }

        value = '' + value;

        var trim = this.trimSlashes(<string>value);

        if(!(this.utils.isEmpty(trim) || trim[0] === '?')) {
            url += '/';
        }

        return url + trim;
    }

    protected trimSlashes(value: string): string {
        if(value[0] === '/') {
            value = value.slice(1);
        }

        return value;
    }

    protected getQueryString(query: IObject<any> = {}): string {
        return '?' + this.utils.map((value, key) => {
            return `${key}=${value}`;
        }, query).join('&');
    }

    protected handleError(response: ajax.IResponseBody): void {
        switch (response.status) {
            case 'fail':
                throw response.data;
            case 'error':
                this.log.warn(response.message);
                throw new Error('Internal server error. Please try again at another time.');
                break;
        }
    }
}
