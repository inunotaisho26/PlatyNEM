import {isObject} from 'lodash';
import {createTransport} from 'nodemailer';
import {Promise} from 'es6-promise';
import {smtp} from '../config/global';

var sgTransport = require('nodemailer-sendgrid-transport');

export function sendEmail(mailOptions: IMailOptions): Promise<{ success: string }>;
export function sendEmail(mailOptions: any) {
	var smtpTransport = createTransport({
		service: smtp.service,
		auth: {
			user: smtp.username,
			pass: smtp.password
		}
	});

	return new Promise<{ success: string }>((resolve, reject) => {
		smtpTransport.sendMail(mailOptions, (err) => {
			if (isObject(err)) {
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
