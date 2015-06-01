/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');
import ManageUserViewControl = require('../manage/manage.viewcontrol');
import UserRepository = require('../../../../repositories/user.repository');

class ListUsersViewControl extends AdminBaseViewControl {
    title = 'All Users';
    templateString = require('./list.viewcontrol.html');
    context = {
        users: <Array<models.IUser>>null,
        manageView: ManageUserViewControl
    };
    
    constructor(private userRepository: UserRepository,
        private animator: plat.ui.animations.Animator) {
        super();
    }

    initialize() {
        var context = this.context;
        
        this.userRepository.all().then((result) => {
            context.users = result;
        });
    }
}

plat.register.viewControl('listusers-vc', ListUsersViewControl, [
    UserRepository,
    plat.ui.animations.Animator
]);

export = ListUsersViewControl;