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
        roles: ['admin', 'visitor'],
        editMode: false,
        avatarPrompt: 'Select a new avatar'
    };

    constructor(private userRepository: UserRepository) {
        super();
    }

    navigatedTo(parameters: { id: string }) {
        var context = this.context;
        
        if (!isNaN(Number(parameters.id))) {
            context.editMode = true;
            this.userRepository.one(parameters.id).then((user: models.IUser) => {
                context.user = user;
            });
        }
    }

    updateUser(user: models.IUser) {
        var context = this.context;
        
        if (context.editMode) {
            this.userRepository.update(user).then((result) => {
                console.log(result);
            });   
        } else {
            this.userRepository.create(user, context.password).then((result) => {
                console.log(result);
            });
        }
    }
    
    avatarSelected(ev) {
        this.context.avatarPrompt = ev.target.files[0].name;
        this.enableSave();
    }

    enableSave() {
        this.saveButton.element.removeAttribute('disabled');
    }
}

plat.register.viewControl('manageuser-vc', ViewControl, [
    UserRepository
]);

export = ViewControl;
