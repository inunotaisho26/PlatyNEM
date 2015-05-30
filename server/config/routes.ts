/// <reference path="../references.d.ts" />

import express = require('express');
import passport = require('passport');
import users = require('../controllers/user.controller');
import posts = require('../controllers/post.controller');

var configure = (baseRoute: string, router: express.Router) => {
    users.initialize(baseRoute + '/users', router);
    posts.initialize(baseRoute + '/posts', router);
    return router;
}

export = configure;
