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
        manageView: ManageUserViewControl,
        deleteModal: false
    };
    
    toDeleteId: string;
    
    constructor(private userRepository: UserRepository,
        private animator: plat.ui.animations.Animator) {
        super();
    }

    initialize() {
        var context = this.context;
        
        this.refreshUsers();
    }
    
    toggleDeleteModal(id?: string) {
        var context = this.context;
        
        context.deleteModal = !context.deleteModal;
        
        if (!this.utils.isNull(id)) {
            this.toDeleteId = id;
        }
    }
    
    refreshUsers() {
        this.userRepository.all().then((result) => {
            this.context.users = result;
        });
    }
    
    confirmDelete() {
        this.userRepository.destroy(this.toDeleteId).then((result) => {
           this.toDeleteId = null;
           this.context.deleteModal = false;
           this.refreshUsers();
        });
    }
}

plat.register.viewControl('listusers-vc', ListUsersViewControl, [
    UserRepository,
    plat.ui.animations.Animator
]);

export = ListUsersViewControl;