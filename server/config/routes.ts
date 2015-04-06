/// <reference path="../references.d.ts" />

import express = require('express');
import passport = require('passport');
import users = require('../controllers/user.controller');

var configure = (baseRoute: string, router: express.Router) => {
    users.initialize(baseRoute + '/users', router);
    return router;
}

export = configure;
