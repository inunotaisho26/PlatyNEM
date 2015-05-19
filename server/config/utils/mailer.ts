/// <reference path="../../references.d.ts" />

import nodemailer = require('nodemailer');
import PromiseStatic = require('es6-promise');
import config = require('../env/all');
import utils = require('./utils');

var sgTransport = require('nodemail-sendgrid-transport');
var Promise = PromiseStatic.Promise;

export function sendEmail(mailOptions: IMailOptions): Promise<{ success: string }>;
export function sendEmail(mailOptions: any) {
	var smtpTransport = nodemailer.createTransport(sgTransport({
		auth: {
			api_user: config.contact.username,
			api_key: config.contact.password
		}
	}));
	
	return new Promise<{ success: string }>((resolve, reject) => {
		smtpTransport.sendMail(mailOptions, (err) => {
			if (utils.isObject(err)) {
				console.log(err);
				return reject(err);
			}
			resolve();
		});
	});
}

export interface IMailOptions {
	to: string;
	toname?: string;
	from: string;
	fromname?: string;
	subject: string;
	html?: string;
}
