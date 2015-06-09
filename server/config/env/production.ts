/// <reference path="../../references.d.ts" />

import path = require('path');

var port = 5000;

var config: models.IConfig = {
    app: {
        name: 'BlogStarter',
        url: 'http://localhost:' + port,
        dist: './client/dist/',
        uploads: '/assets'
    },
    db: {
        host: '127.0.0.1',
        user: '3l33t',
        password: 'uw0tm8',
        dbName: 'depot',
        connectionLimit: 2
    },
    smtp: {
        service: 'Gmail',
        username: 'darion.welch@gmail.com',
        password: 'Darjeeling01'
    },
    sessionKey: 'You should change this',
    port: process.env.PORT || port,
    root: path.normalize(__dirname + '../../../..')
};

export = config;
