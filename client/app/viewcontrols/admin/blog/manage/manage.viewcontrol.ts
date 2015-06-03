/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');
import PostRepository = require('../../../../repositories/post.repository');
import UserRepository = require('../../../../repositories/user.repository');
import quill = require('../../../../common/injectables/quill.injectable');

class ViewControl extends AdminBaseViewControl {
    title = 'Manage Post';
    templateString = require('./manage.viewcontrol.html');
    
    quillEditor: any;
    quillElement: plat.controls.INamedElement<HTMLDivElement, any>;
    savePostButton: plat.controls.INamedElement<HTMLElement, any>;
    initializeEditorPromise: () => plat.async.IThenable<string>;
    
    context = {
        post: <models.IPost>{
            title: '',
            id: null,
            created: null
        },
        user: null
    };
    
    constructor(private postRepository: PostRepository,
        private userRepository: UserRepository,
        private quill: any) {
        super();
    }
    
    formatCode() {
        
    }
    
    save(publish: boolean) {
        var context = this.context;
        var promise: plat.async.IThenable<any>;
        var post = <models.IPost>this.utils.clone(this.utils.extend({}, context.post, {
            content: this.quillEditor.getHTML(),
            published: publish
        }), true);
        
        this.dom.addClass(this.savePostButton.element, 'disabled');
        
        if (this.utils.isNumber(context.post.id)) {
            promise = this.postRepository.update(post);
        } else {
            post.created = new Date();
            post.userid = <number>context.user.id;
            post.user = context.user;
            context.post = <models.IPost>this.utils.clone(post, true);
            
            promise = this.postRepository.create(post).then((postId: number) => {
               context.post.id = postId; 
            });
        }
        
        return promise.catch((errors: Array<Error>) => {
           
        }).then(() => {
            context.post.published = this.utils.isNumber(context.post.id);
            this.dom.removeClass(this.savePostButton.element, 'disabled');
        });
    }
    
    loaded() {
        this.quillEditor = new this.quill(this.quillElement.element, {
            styles: { 
                '.ql-editor': { 'font-size' : '16px' } 
            }
        });
        
        this.quillElement.element.addEventListener('click', () => {
           this.quillEditor.focus(); 
        });
        
        this.initializeEditorPromise().then((content) => {
            this.quillEditor.setHTML(content);    
        });
        
        this.quillEditor.addModule('toolbar', {
            container: '#quill-toolbar'
        });
        
        this.quillEditor.focus();
    }
    
    navigatedTo(params: any) {
        var context = this.context;
        
        if (!isNaN(Number(params.id))) {
            this.initializeEditorPromise = () => {
                return this.postRepository
                .one(params.id)
                .then((post) => {
                    context.post = post;
                    return post.content;
                });
            };
        } else {
            this.initializeEditorPromise = () => {
                return this._Promise.resolve('');
            };
            this.userRepository
                .current()
                .then((user) => {
                    context.user = user;
                });
        }
    }
}

plat.register.viewControl('managepost-vc', ViewControl, [
    PostRepository,
    UserRepository,
    quill.quillFactory
]);

export = ViewControl;
