/// <reference path="../../references.d.ts" />

import mysql = require('mysql');
import utils = require('../utils/utils');
import config = require('../env/all');

var pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.dbName,
    connectionLimit: config.db.connectionLimit
});

pool.on('connection', (connection: mysql.IConnection) => {
    connection.on('error', (err: mysql.IError) => {
        if (utils.isObject(err)) {
            console.log(err);
            connection.release();
        }
    });
});

export = pool;
