/// <reference path="../references.d.ts" />

import passport = require('passport');
import Local = require('passport-local');
import PromiseStatic = require('es6-promise');

var Promise = PromiseStatic.Promise,
	LocalStrategy = Local.Strategy;

var passportConfig = (passport: passport.Passport, config) => {
	
};

export = passportConfig;
