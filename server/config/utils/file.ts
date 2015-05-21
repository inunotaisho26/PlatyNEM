/// <reference path="../../references.d.ts" />

import PromiseStatic = require('es6-promise');
import fs = require('fs');
import utils = require('./utils');
import config = require('../env/all');
import path = require('path');

var Promise = PromiseStatic.Promise;

export var upload = (tmpPath: string, rename: string, base: string = 'avatars'): Thenable<string> => {
    var destFile = rename + path.extname(tmpPath);
    var destDir = path.join(path.dirname(tmpPath), base);
    
    return ensureDir(destDir).then(() => {
        return move(tmpPath, path.join(destDir, destFile));
    }).then(() => {
        return path.join(config.app.uploads, base, destFile);
    });
};

export var ensureDir = (path: string): Thenable<any> => {
    if (utils.isString(path)) {
        return dirExists(path).then(() => {
           return Promise.resolve(); 
        }).catch(() => {
            fs.mkdir(path, (err: NodeJS.ErrnoException) => {
                if (err) {
                    return Promise.reject(err);
                }
                return Promise.resolve();
            });
        });
    }
};

export var destroy = (file: any) => {
    if (utils.isObject(file)) {
        return fileExists(file.path).then(() => {
           return unlink(file.path); 
        }, () => {
           return Promise.resolve(null);
        });
    }
    
    return Promise.resolve(null);
};

export var move = (origin: string, destination: string) => {
    return new Promise((resolve, reject) => {
        fs.rename(origin, destination, (err: NodeJS.ErrnoException) => {
            if (err) {
                return reject(err);
            }
            resolve();
        }) ;
    });
}

export var fileExists = (path: string) => {
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

export var dirExists = (path: string) => {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err: NodeJS.ErrnoException, stats) => {
            if (err) {
                return reject(err);
            }
            
            if (stats.isDirectory) {
                resolve();
            }
        });
    });
}

export var unlink = (path: string) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err: NodeJS.ErrnoException) => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    });
}
