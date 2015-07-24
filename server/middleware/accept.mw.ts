import {parse} from 'url';
import {join} from 'path';
import {stat} from 'fs';
import {Request, Response} from 'express';

var vary = require('vary');

function valueInArray(value: string, array: Array<string>): boolean {
    for (var i = 0, len = array.length; i < len; i++) {
        if (value === array[i]) {
            return true;
        }
    }
    return false;
}

export var acceptImage = (dirname: string, extensions?: Array<string>): (req: Request, res: Response, next: Function) => void => {
    if (!!extensions && typeof extensions === 'string') {
        extensions = [<string><any>extensions];
    } else if (extensions === undefined) {
        extensions = ['jpg', 'png', 'jpeg'];
    }

    return function (req: Request, res: Response, next: Function): void {
        var method = req.method.toUpperCase();

        if (method !== 'GET' && method !== 'HEAD') {
            next(); return;
        }

        var pathname = parse(req.url).pathname,
            extpos = pathname.lastIndexOf('.'),
            ext = pathname.substr(extpos + 1),
            ua = req.headers['user-agent'],
            ie = /msie/i.test(ua) || /\strident\//i.test(ua),
            accept: string = (<any>req.headers).accept,
            webp = !!accept && accept.indexOf('image/webp') > -1;

        if (valueInArray(ext, extensions) && (ie || webp)) {
            var newPathname = pathname.substr(0, extpos) + (ie ? '.jxr' : '.webp'),
                filePath = join(dirname, newPathname);

            stat(filePath, function (err, stats): void {
                if (err) {
                    next();
                } else if (stats.isFile()) {
                    req.url = req.url.replace(pathname, newPathname);
                    vary(res, 'Accept');

                    if (ie) {
                        res.setHeader('Content-Type', 'image/vnd.ms-photo');
                    }

                    next();
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    };
};

export default acceptImage;
