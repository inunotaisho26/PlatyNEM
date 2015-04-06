/// <reference path="../../references.d.ts" />

import PromiseStatic = require('es6-promise');
import fs = require('fs');
import utils = require('./utils');
import config = require('../env/all');
import path = require('path');

var Promise = PromiseStatic.Promise;

export var upload = (tmpPath: string, rename: string) => {
    return new Promise<string>((resolve, reject) => {
        var filename = '/avatars/' + rename + path.extname(tmpPath);
        var destPath = path.join(path.dirname(tmpPath), filename);
        
        fs.rename(tmpPath, destPath, (err) => {
            if (err) {
                return reject(err)
            }
            resolve(path.join(config.app.uploads, filename));
        });
    });
};

export var destroy = (file: any) => {
    if (!utils.isObject(file)) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        fs.unlink(file.path, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};
