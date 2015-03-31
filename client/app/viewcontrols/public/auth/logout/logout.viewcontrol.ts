/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import UserRepository = require('../../../../repositories/user.repository');
import BaseViewControl = require('../../../base.viewcontrol');

class LogOutViewControl extends BaseViewControl {
	title = 'Platypi | Logout';

	constructor(private userRepository: UserRepository) {
	    super();
	}

	context = {};

	navigatedTo() {
		this.userRepository.logout()
			.catch(this.utils.noop)
			.then(() => {
				this.navigator.navigate('public-vc', {
					replace: true
				});
			});
	}
}

plat.register.viewControl('logout-vc', LogOutViewControl, [
	UserRepository
]);

export = LogOutViewControl;
