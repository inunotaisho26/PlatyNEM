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
    flipper: plat.controls.INamedElement<HTMLLIElement, any>;
    shownElement: number = null;

    constructor(private userRepository: UserRepository,
        private userFactory: models.UserFactory,
        private animator: plat.ui.animations.Animator) {
        super();
    }

    initialize() {
        var context = this.context;
        
        this.userRepository.all().then((result) => {
            context.users = result;
        });
    }

    editUser(index) {
        var userElements = this.flipper.element.children;
        var context = this.context;

        if (!this.utils.isNull(this.shownElement) && this.shownElement != index) { 
            this.flipUserElement(userElements[this.shownElement].firstElementChild, false).then(() => {
                context.editableUser = context.users[index];
                this.shownElement = index;
                return this.flipUserElement(userElements[index].firstElementChild);
            })
        } else {
            context.editableUser = context.users[index];
            this.shownElement = index;
            this.flipUserElement(userElements[index].firstElementChild);
        }
    }

    cancelEdit(index) {
        this.flipUserElement(this.flipper.element.children[index].firstElementChild, false).then(() => {
            this.context.editableUser = null;
            this.shownElement = null;
        });
    }
    
    flipUserElement(element: Element, showDetails: boolean = true) {
        var degrees = showDetails ? '180deg' : '0deg';
        
        return this.animator.animate(element, 'plat-transition', {
            properties: {
                'transform': 'rotateY(' + degrees + ')'
            }
        });
    }

    enableSave(index: number) {
        this.dom.addClass(this.flipper.element.children[index], 'value-changed');
    }

    updateUser(user: models.IUser) {
        console.log(user);
    }

    createUser() {
        var context = this.context;
        var users = context.users;

        users.push({
            firstname: 'First',
            lastname: 'Last',
            email: 'name@example.com'
        });

        this.utils.defer(() => { 
            this.flipUserElement(this.flipper.element.children[users.length - 1].firstElementChild).then(() => {
                context.editableUser = null;
                this.shownElement = null;
            });
        }, 300);
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
    models.UserFactory,
    plat.ui.animations.Animator
]);

export = ListUsersViewControl;