/// <reference path="./typings/tsd.d.ts" />

import express = require('express');
import config = require('./config/env/all');

var app = express();

require('./config/express')(app);

app.listen(config.port, () => {
	console.log('Listening on port ' + config.port);
});

export = app;
