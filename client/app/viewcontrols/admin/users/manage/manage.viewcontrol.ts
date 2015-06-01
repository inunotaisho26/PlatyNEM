/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import UserRepository = require('../../../../repositories/user.repository');
import AdminBaseViewControl = require('../../base.viewcontrol');

class ViewControl extends AdminBaseViewControl {
    title = 'Edit User';
    templateString = require('./manage.viewcontrol.html');
    saveButton: plat.controls.INamedElement<HTMLButtonElement, any>;
    context = {
        user: <models.IUser>{},
        password: <string>null,
        newpassword: <string>null,
        confirmpassword: <string>null,
        roles: ['admin', 'visitor']
    };

    constructor(private userRepository: UserRepository) {
        super();
    }

    navigatedTo(parameters: { id: string }) {
        this.userRepository.one(parameters.id).then((user: models.IUser) => {
            console.log(user);
            this.context.user = user;
        });
    }

    updateUser(user: models.IUser) {
        this.userRepository.update(user).then((result) => {
            console.log(result);
        });
    }

    enableSave() {
        this.saveButton.element.removeAttribute('disabled');
    }
}

plat.register.viewControl('manageuser-vc', ViewControl, [
    UserRepository
]);

export = ViewControl;
