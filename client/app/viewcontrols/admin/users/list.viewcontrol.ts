/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../base.viewcontrol');

class ListUsersViewControl extends AdminBaseViewControl {
	title = 'All Users';
 	templateString = require('./list.viewcontrol.html');
 	context = {
 		users: [
 			{
 				name: 'Darion Welch',
 				email: 'darion.welch@gmail.com'
 			},
 			{
 				name: 'Emily Nicholson',
 				email: 'emily@gmail.com'
 			},
 			{
 				name: 'Claire Flowers',
 				email: 'claire@gmail.com'
 			},
 			{
 				name: 'Matt Landers',
 				email: 'matt@gmail.com'
 			}
 		]
 	};
}

plat.register.viewControl('listusers-vc', ListUsersViewControl);

export = ListUsersViewControl;