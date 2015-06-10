/// <reference path="../../references.d.ts" />

import nodemailer = require('nodemailer');
import PromiseStatic = require('es6-promise');
import config = require('../env/all');
import utils = require('./utils');

var sgTransport = require('nodemailer-sendgrid-transport');
var Promise = PromiseStatic.Promise;

export function sendEmail(mailOptions: IMailOptions): Promise<{ success: string }>;
export function sendEmail(mailOptions: any) {
	var smtpTransport = nodemailer.createTransport({
		service: config.smtp.service,
		auth: {
			user: config.smtp.username,
			pass: config.smtp.password
		}
	});
	
	return new Promise<{ success: string }>((resolve, reject) => {
		smtpTransport.sendMail(mailOptions, (err) => {
			if (utils.isObject(err)) {
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
	attachments?: Array<IAttachment>;
}

export interface IAttachment {
	filename?: string;
	path?: string;
	content?: any;
}
