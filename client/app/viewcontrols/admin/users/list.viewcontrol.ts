/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../base.viewcontrol');
import UserRepository = require('../../../repositories/user.repository');

class ListUsersViewControl extends AdminBaseViewControl {
	title = 'All Users';
 	templateString = require('./list.viewcontrol.html');
 	context = {
 		users: []
 	};

 	constructor(private userRepository: UserRepository) {
 		super();
 	}

 	initialize() {
 		var context = this.context;
 		
 		this.userRepository.all().then((result) => {
 			console.log(result);
 			context.users = result;
 		}, (err) => {
 			// handle error
 		});
 	}
}

plat.register.viewControl('listusers-vc', ListUsersViewControl, [
	UserRepository
]);

export = ListUsersViewControl;