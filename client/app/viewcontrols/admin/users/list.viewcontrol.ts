/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../base.viewcontrol');
import UserRepository = require('../../../repositories/user.repository');
import models = require('../../../models/user.model');

class ListUsersViewControl extends AdminBaseViewControl {
    title = 'All Users';
    templateString = require('./list.viewcontrol.html');
    context = {
        users: [],
        editableUser: <models.IUser> {}
    };
    userFlipper: plat.controls.INamedElement<HTMLLIElement, any>;
    shownElement: number = null;

    constructor(private userRepository: UserRepository,
        private userFactory: models.UserFactory) {
        super();
    }

    initialize() {
        var context = this.context;
        
        this.userRepository.all().then((result) => {
            context.users = result;
        });
    }

    showUserDetails(index: number) {
        var context = this.context;

        if (index != this.shownElement) {
            this.hideUserDetails(this.shownElement);
        }

        context.editableUser = this.userFactory.create(context.users[index]);

        this.dom.addClass(this.userFlipper.element.children[index], 'flip');
        this.shownElement = index;
        console.log(context.editableUser);
    }

    hideUserDetails(index: number) {
        this.dom.removeClass(this.userFlipper.element.children[index], 'flip');
    }

    enableSave(index: number) {
        this.dom.addClass(this.userFlipper.element.children[index], 'value-changed');
    }

    updateUser(user: models.IUser) {
        console.log(user);
    }

    cancelUpdate() {

    }

    changeAvatar(index: number, ev) {
        if (ev.target.files && ev.target.files.length === 1) {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.context.editableUser.avatar = (<any>e.target).result;
            }
            reader.readAsDataURL(ev.target.files[0]);
            this.enableSave(index);
        }
    }
}

plat.register.viewControl('listusers-vc', ListUsersViewControl, [
    UserRepository,
    models.UserFactory
]);

export = ListUsersViewControl;