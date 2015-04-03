/// <reference path="./typings/tsd.d.ts" />

import express = require('express');
import passport = require('passport');
import config = require('./config/env/all');

var app = express();

require('./config/passport')(passport, config);
require('./config/express')(app, config);

app.listen(config.port, () => {
	console.log('Listening on port ' + config.port + ' in ' + process.env.NODE_ENV);
});

export = app;
