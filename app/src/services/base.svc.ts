import {async, debug, register, Utils} from 'platypus';

export default class BaseService {
    protected static _inject: any = {
        http: async.Http,
        utils: Utils,
        promise: async.IPromise,
        log: debug.Log
    };

    protected utils: Utils;
    protected http: async.Http;
    protected Promise: async.IPromise
    protected log: debug.Log;

    baseRoute: string;

    constructor(baseRoute: string = '') {
        this.baseRoute = 'api/' + baseRoute;
    }

    protected _get<T>(...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _get<T>(options?: IHttpConfig, ...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _get<T>(options?: any, ...urlParams: Array<string | number>): async.IAjaxThenable<T> {
        return this._do<T>('GET', options, urlParams);
    }

    protected _post<T>(...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _post<T>(options?: IHttpConfig, ...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _post<T>(options?: any, ...urlParams: Array<string | number>): async.IAjaxThenable<T> {
        return this._do<T>('POST', options, urlParams);
    }

    protected _put<T>(...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _put<T>(options?: IHttpConfig, ...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _put<T>(options?: any, ...urlParams: Array<string | number>): async.IAjaxThenable<T> {
        return this._do<T>('PUT', options, urlParams);
    }

    protected _delete<T>(...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _delete<T>(options?: IHttpConfig, ...urlParams: Array<string | number>): async.IAjaxThenable<T>;
    protected _delete<T>(options?: any, ...urlParams: Array<string | number>): async.IAjaxThenable<T> {
        return this._do<T>('DELETE', options, urlParams);
    }

    protected _do<T>(method: string, urlParam?: string, urlParams?: Array<string | number>): async.IAjaxThenable<T>;
    protected _do<T>(method: string, options?: IHttpConfig, urlParams?: Array<string | number>): async.IAjaxThenable<T>;
    protected _do<T>(method: string, options?: any, urlParams: Array<string | number> = []): async.IAjaxThenable<T> {
        if (!this.utils.isObject(options)) {
            if (!this.utils.isUndefined(options)) {
                urlParams.unshift(options);
            }

            options = {};
        }

        return this._json<T>(this.utils.extend({
            url: this._buildUrl.apply(this, urlParams),
            method: method
        }, options));
    }

    protected _buildUrl(...urlParams) {
        var url = '/' + this.baseRoute;

        this.utils.forEach((param) => {
            if (param[0] === '?' || param[0] === '&') {
                url += param;
                return;
            }
            url += '/' + param;
        }, urlParams);

        return url;
    }

    protected _handleError(response: ajax.IResponseBody) {
        switch (response.status) {
            case 'fail':
                throw response.data;
            case 'error':
                this.log.warn(response.message);
                break;
        }
    }

    protected _json<T>(options: async.IHttpConfig): async.IAjaxThenable<T> {
        return this.http.json<ajax.IResponseBody>(options).then((result) => {
            return result.response.data;
        }, (result) => {
            this._handleError(result.response);
        });
    }
}

interface IHttpConfig {
    url?: string;
    method?: string;
    contentType?: string;
}
