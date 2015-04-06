 /// <reference path="../../references.d.ts" />

 import utils = require('./utils');

 export var response = (err?: any, data?: any): models.IFormattedResponse => {
    if (utils.isObject(err)) {
        if (err instanceof Error && !utils.isObject(err.errors)) {
            return {
                status: 500,
                body: {
                    status: 'error',
                    body: {
                        status: 'error',
                        message: err.message,
                        data: err
                    }
                }
            }
        }

        return {
            status: 400,
            body: {
                status: 'fail',
                data: err
            }
        }
    }

    data = filterUser(data, [
        'hashedPassword',
        'salt',
        'resetPasswordToken',
        'resetPasswordExpires',
        'password'
    ]);

    return {
        status: 200,
        body: {
            status: 'success',
            data: data
        }
    }
 };

var filterUser = (obj: { user?: models.IUser }, properties: Array<string>): { user?: models.IUser }  => {
    var user: models.IUser;

    if (!utils.isObject(obj)) {
        return obj;
    } else if (utils.isArray(obj)) {
        (<Array<typeof obj>><any>obj).map((value, index) => {
            (<any>obj)[index] = filterUser(value, properties);
        });
        return obj;
    } else if (!utils.isObject(obj.user)) {
        return filterUser({ user: <any>obj }, properties).user;
    }

    user = obj.user;
    obj.user = utils.omit(user, properties);

    return obj;
};