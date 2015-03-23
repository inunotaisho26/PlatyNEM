/// <reference path="../../typings/tsd.d.ts" />

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./' + process.env.NODE_ENV) || {};

export = config;