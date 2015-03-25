/// <reference path="../../references.d.ts" />

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./' + process.env.NODE_ENV) || {};

export = config;
