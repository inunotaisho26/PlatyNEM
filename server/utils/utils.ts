import * as fs from 'fs-extra';
import * as path from 'path';
import * as utils from 'lodash';
import {Promise} from 'es6-promise';
import {isObject} from 'lodash';
import {app} from '../config/global';

export function upload(tmpPath: string, rename: string, base: string = 'avatars'): Thenable<string> {
    var destFile = rename + path.extname(tmpPath);
    var destDir = path.join(path.dirname(tmpPath), base);

    return ensureDir(destDir).then(() => {
        return move(tmpPath, path.join(destDir, destFile));
    }).then(() => {
        return path.join(app.uploads, base, destFile);
    });
}

export function ensureDir(dir: string): Thenable<any> {
    return new Promise((resolve, reject) => {
        if (utils.isString(path)) {
            fs.ensureDir(dir, (err) => {
                if(utils.isObject(err)) {
                    return reject(err);
                }

                resolve();
            });
            return;
        }

        resolve();
    });
}

export function destroy(file: any | string): Thenable<any> {
    var f: string;

    if (utils.isObject(file)) {
        f = file.path;
    } else if (utils.isString(file)) {
        f = file;
    } else {
        return Promise.resolve(null);
    }

    return fileExists(f).then(() => {
       return unlink(f);
    }, () => {
       return Promise.resolve(null);
    });
}

export function fileExists(path: string): Thenable<any> {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err: NodeJS.ErrnoException, stats) => {
            if (err) {
                return reject(err);
            }

            if (stats.isFile) {
                resolve();
            }
        })
    })
}

export function move(origin: string, destination: string) {
    return new Promise((resolve, reject) => {
        fs.rename(origin, destination, (err: NodeJS.ErrnoException) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export function unlink(path: string): Thenable<any> {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err: NodeJS.ErrnoException) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}


export function pluralize(str: string): string {
    var last = str.slice(-2);

    if (last[1] === 'y') {
        return str.slice(0, -1) + 'ies';
    } else if (/(?:.[s|z|x]|ch|sh)$/.test(last)) {
        return str + 'es';
    }

    return str + 's';
}

export function isFileExt(file: string): boolean {
    var len = file.length;

    if (file.indexOf('.') === -1) {
        return false;
    } else if (!(file[len - 5] === '.' ||
        file[len - 4] === '.' ||
        file[len - 3] === '.' ||
        file[len - 2] === '.' ||
        file[len - 1] === '.')) {
        return false;
    } else if (file.indexOf('/api') === 0 || file.indexOf('/?') === 0) {
        return false;
    }

    return true;
}

export function mkdir(dir: string): Thenable<void> {
    return new Promise<void>((resolve, reject) => {
        fs.mkdirp(dir, (err) => {
            if(isObject(err)) {
                return reject(err);
            }

            resolve();
        });
    });
}
