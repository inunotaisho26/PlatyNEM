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

    // Lifecycle Methods

    initialize() {
        var context = this.context;
        
        this.userRepository.all().then((result) => {
            context.users = result;
        });
    }

    // Create Methods

    createUser() {
        var context = this.context;
        var users = context.users;
        var userElements = this.flipper.element.children;

        users.unshift({
            firstname: 'First',
            lastname: 'Last',
            email: 'name@example.com'
        });

        this.utils.defer(() => {
            this.flipUserElement(0);
        }, 300);
    }

    // Edit Methods

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

    enableSave(index: number) {
        this.dom.addClass(this.flipper.element.children[index], 'value-changed');
    }

    cancelEdit(index, user) {
        var context = this.context;

        this.animateFlip(this.flipper.element.children[index].firstElementChild, false).then(() => {
            context.editableUser = null;
            this.shownElement = null;
        }).then(() => {
            if (this.utils.isNull(user.id)) {
                context.users.splice(0, 1);
            }
        });
    }

    updateUser(user: models.IUser) {
        this.userRepository.update(user).then((result) => {
            console.log(result);
        });
    }

    // Create/Edit UI Methods

    flipUserElement(usersIndex: number): plat.async.IThenable<any> {
        var context = this.context;
        var userElements = this.flipper.element.children;
        var promise: plat.async.IThenable<any> = this._Promise.resolve();

        if (!this.utils.isNull(this.shownElement) && this.shownElement !== usersIndex) {
            promise = this.animateFlip(userElements[this.shownElement].firstElementChild, false);
        }

        return promise
            .then(() => {
                context.editableUser = context.users[usersIndex];
                this.shownElement = usersIndex;
            })
            .then(() => {
                return this.animateFlip(userElements[usersIndex].firstElementChild);
            });
    }
    
    animateFlip(element: Element, showDetails: boolean = true) {
        var degrees = showDetails ? '180deg' : '0deg';

        return this.animator.animate(element, 'plat-transition', {
            properties: {
                'transform': 'rotateY(' + degrees + ')'
            }
        });
    }
}

plat.register.viewControl('listusers-vc', ListUsersViewControl, [
    UserRepository,
    models.UserFactory,
    plat.ui.animations.Animator
]);

export = ListUsersViewControl;