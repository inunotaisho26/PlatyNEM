/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');
import PostRepository = require('../../../../repositories/post.repository');
import quill = require('../../../../common/injectables/quill.injectable');

class ViewControl extends AdminBaseViewControl {
    title = 'Manage Post';
    templateString = require('./manage.viewcontrol.html');
    
    quillEditor: any;
    quillElement: plat.controls.INamedElement<HTMLDivElement, any>;
    
    context = {
        post: {
            title: ''
        }
    };
    
    constructor(private postRepository: PostRepository,
        private quill: any) {
        super();
    }
    
    formatCode() {
        
    }
    
    save() {
        var context = this.context;
        
        this.postRepository.create({
            title: context.post.title,
            content: this.quillEditor.getHTML() 
        });
    }
    
    loaded() {
        this.quillEditor = new this.quill(this.quillElement.element, {
            styles: { 
                '.ql-editor': { 'font-size' : '16px' } 
            }
        });
        
        this.quillEditor.addModule('toolbar', {
            container: '#quill-toolbar'
        })
    }
    
    navigatedTo(params: any, query: any) {
        console.log(params);
        console.log(query);
    }
}

plat.register.viewControl('managepost-vc', ViewControl, [
    PostRepository,
    quill.quillFactory
]);

export = ViewControl;
