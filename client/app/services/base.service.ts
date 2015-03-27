/// <reference path="../../references.d.ts" />
/// <reference path="../models/server.model.d.ts" />

class BaseService {
	_utils: plat.Utils = plat.acquire(plat.Utils);
	_http: plat.async.Http = plat.acquire(plat.async.Http);

	baseRoute: string;

	constructor(baseRoute: string = '') { 
		this.baseRoute = 'api/' + baseRoute;
		console.log(this.baseRoute);
	}

	create(data: any, ...urlParams): plat.async.IAjaxThenable<any> {
		return this._json({ 
			data: data, 
			method: 'POST',
			url: this._buildUrl(urlParams)
		});		
	}

	protected _buildUrl(...urlParams) {
		var url = '/' + this.baseRoute;

		this._utils.forEach((param) => {
			if (param[0] === '?' || param[0] === '&') {
				url += param;
				return
			}
			url += '/' + param;
		}, urlParams);

		return url;
	}

	protected _json(options: plat.async.IHttpConfig): plat.async.IAjaxThenable<any> {
		return this._http.json<server.ajax.IResponseBody>(options).then((result) => {
			return result.response.data;
		}, (result) => {
			console.log('Err', result);
		});
	}
}

export = BaseService;
