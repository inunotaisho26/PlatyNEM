/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import UserRepository = require('../../../repositories/user.repository');
import AdminBaseViewControl = require('../base.viewcontrol');

class LogOutViewControl extends AdminBaseViewControl {
    title = 'Platypi | Logout';

    constructor(private userRepository: UserRepository) {
        super();
    }

    context = {};

    navigatedTo() {
        this.userRepository.logout()
            .catch(this.utils.noop)
            .then(() => {
                this.navigator.navigate('', {
                    replace: true
                });
            });
    }
}

plat.register.viewControl('logout-vc', LogOutViewControl, [
    UserRepository
]);

export = LogOutViewControl;
