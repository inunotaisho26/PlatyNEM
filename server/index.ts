import * as express from 'express';
import * as passport from 'passport';
import {port} from './config/global';
import configureApp from './config/express';
import configureDb from './config/db';
import configurePassport from './config/passport';

configurePassport(passport);
var app = express();
configureApp(app);
configureDb();

var server = app.listen(port, () => {
	console.log(`Listening on port ${server.address().port}.`);
});
