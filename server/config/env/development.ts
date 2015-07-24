/// <reference path="../../references.d.ts" />

import path = require('path');

var port = 3000;

var config: models.IConfig = {
    app: {
        name: 'Blogstarter',
        url: 'http://localhost:' + port,
        dist: './client/dist/',
        uploads: '/assets'
    },
    db: {
        host: '127.0.0.1',
        user: '3l33t',
        password: 'uw0tm8',
        dbName: 'blogstarter',
        connectionLimit: 2
    },
    facebook: {
        clientID: 'your facebook app id',
        clientSecret: 'your facebook app secret',
        callbackURL: 'http://localhost:3000/auth/facebook/callback/',
        profileFields: [
            'id',
            'displayName',
            'photos',
            'emails'
        ]
    },
    googleAnalyticsID: '5555555',
    smtp: {
        service: 'Gmail',
        username: 'example@gmail.com',
        password: 'password'
    },
    sessionKey: 'You should change this',
    port: port,
    root: path.normalize(__dirname + '../../../..')
};

export = config;
