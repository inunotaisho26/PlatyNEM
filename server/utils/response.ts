import {isArray, isObject, omit} from 'lodash';

function filterUser(obj: any, properties: Array<string>): any {
    var user: any;

    if (!isObject(obj)) {
        return obj;
    } else if (isArray(obj)) {
        (<Array<typeof obj>><any>obj).map((value, index) => {
            (<any>obj)[index] = filterUser(value, properties);
        });
        return obj;
    } else if (!isObject(obj.user)) {
        return filterUser({ user: <any>obj }, properties).user;
    }

    user = obj.user;
    obj.user = omit(user, properties);

    return obj;
}

export var format = (err?: any, data?: any): server.utils.IFormattedResponse => {
    if (isObject(err)) {
        if (err instanceof Error && !isObject(err.errors)) {
            return {
                status: 500,
                body: {
                    status: 'error',
                    message: err.message,
                    data: err
                }
            };
        }

        return {
            status: 400,
            body: {
                status: 'fail',
                data: err
            }
        };
    }

    data = filterUser(data, [
        'hashedpassword',
        'salt',
        'resetpasswordtoken',
        'resetpasswordexpires',
        'password'
    ]);

    return {
        status: 200,
        body: {
            status: 'success',
            data: data
        }
    };
};

export default format;
