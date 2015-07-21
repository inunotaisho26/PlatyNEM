/// <reference path="../../references.d.ts" />

import mysql = require('mysql');
import utils = require('../utils/utils');
import config = require('../env/all');

var pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.dbName,
    connectionLimit: config.db.connectionLimit,
    timezone: 'utc'
});

pool.on('connection', (connection: mysql.IConnection) => {
    connection.on('error', (err: mysql.IError) => {
        if (utils.isObject(err)) {
            console.log(err);
            connection.release();
        }
    });
});

/// Ping database every 60 seconds
setInterval(() => {
    pool.getConnection((err, connection) => {
        if (utils.isObject(err)) {
            console.log(err);
            return;
        }
        
        (<any>connection).ping((err) => {
            if (utils.isObject(err)) {
                console.log(err);
            }
            connection.release();
        });
    });
}, 60000);

export = pool;
