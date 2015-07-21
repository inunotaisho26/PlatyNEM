import {async, debug, register, Utils} from 'platypus';

export class BaseService {
    protected static _inject: any = {
        _http: async.Http,
        _utils: Utils,
        _promise: async.IPromise,
        _log: debug.Log
    };

    protected _utils: Utils;
    protected _http: async.Http;
    protected _Promise: async.IPromise
    protected _log: debug.Log;

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
        if (!this._utils.isObject(options)) {
            if (!this._utils.isUndefined(options)) {
                urlParams.unshift(options);
            }

            options = {};
        }

        return this._json<T>(this._utils.extend({
            url: this._buildUrl.apply(this, urlParams),
            method: method
        }, options));
    }

    protected _buildUrl(...urlParams) {
        var url = '/' + this.baseRoute;

        this._utils.forEach((param) => {
            if (param[0] === '?' || param[0] === '&') {
                url += param;
                return;
            }
            url += '/' + param;
        }, urlParams);

        return url;
    }

    protected _handleError(response: server.ajax.IResponseBody) {
        switch (response.status) {
            case 'fail':
                throw response.data;
            case 'error':
                this._log.warn(response.message);
                break;
        }
    }

    protected _json<T>(options: async.IHttpConfig): async.IAjaxThenable<T> {
        return this._http.json<server.ajax.IResponseBody>(options).then((result) => {
            return result.response.data;
        }, (result) => {
            this._handleError(result.response);
        });
    }
}

export interface IHttpConfig {
    url?: string;
    method?: string;
    contentType?: string;
}
