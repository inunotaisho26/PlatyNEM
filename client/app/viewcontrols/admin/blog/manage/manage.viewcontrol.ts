/// <reference path="../../../../../references.d.ts" />

import plat = require('platypus');
import AdminBaseViewControl = require('../../base.viewcontrol');
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
    
    constructor(private quill: any) {
        super();
    }
    
    formatCode() {
        
    }
    
    save() {
        
    }
    
    loaded() {
        this.quillEditor = new this.quill(this.quillElement.element, {
            formats: ['bold', 'italic', 'color', 'link', 'image', 'bullet', 'list', 'size'],
            styles: { '.ql-editor': { 'font-size' : '16px' } }
        });
    }
    
    navigatedTo(params: any, query: any) {
        console.log(params);
        console.log(query);
    }
}

plat.register.viewControl('managepost-vc', ViewControl, [
    quill.quillFactory
]);

export = ViewControl;
