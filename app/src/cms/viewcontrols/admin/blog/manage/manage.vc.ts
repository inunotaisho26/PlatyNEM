import {async, controls, register, web} from 'platypus';
import CMSBaseViewControl from '../../../base.vc';
import PostRepository from '../../../../../repositories/post.repo';
import UserRepository from '../../../../../repositories/user.repo';
import quillFactory from '../../../../../injectables/quill';

export default class ViewControl extends CMSBaseViewControl {
    title: string = 'Manage Post';
    templateString: string = require('./manage.vc.html');

    quillEditor: any;
    quillElement: controls.INamedElement<HTMLDivElement, any>;
    savePostButton: controls.INamedElement<HTMLElement, any>;
    initializeEditorPromise: () => async.IThenable<string>;

    context: {
        post: models.IPost;
        user: models.IUser;
        host: string;
    } = {
        post: {
            title: '',
            slug: '',
            id: null,
            created: null
        },
        user: null,
        host: ''
    };

    constructor(private postRepository: PostRepository,
        private userRepository: UserRepository,
        private quill: any,
        private browser: web.Browser) {
        super();
    }

    save(publish: boolean): async.IThenable<void> {
        var context = this.context;
        var promise: async.IThenable<any>;
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
           this.globalAlert.setAlerts(errors, 'fail');
        }).then(() => {
            context.post.published = this.utils.isNumber(context.post.id);
            this.dom.removeClass(this.savePostButton.element, 'disabled');
            this.globalAlert.setAlerts('Post has been saved', 'success');
        });
    }

    loaded(): void {
        this.quillEditor = new this.quill(this.quillElement.element, {
            modules: {
                'link-tooltip': true,
                'image-tooltip': true
            },
            styles: {
                '.ql-editor': { 'font-size' : '16px' }
            }
        });

        this.initializeEditorPromise().then((content) => {
            this.quillEditor.setHTML(content);
        });

        this.quillEditor.addModule('toolbar', {
            container: '#quill-toolbar'
        });

        this.quillElement.element.addEventListener('keydown', (ev) => {
           var modifier = ev.ctrlKey || ev.metaKey;

           if (ev.keyCode === 83 && modifier) {
               ev.preventDefault();
               ev.stopPropagation();
               this.save(true);
               return false;
           }
           return true;
        });

        this.quillEditor.focus();
    }

    navigatedTo(params: any): void {
        var context = this.context;

        // Set host for slug input helper
        context.host = this.browser.urlUtils().host + '/posts/';

        if (!this.utils.isEmpty(params.slug) && params.slug !== 'undefined') {
            this.initializeEditorPromise = () => {
                return this.postRepository
                .read(params.slug)
                .then((post) => {
                    context.post = post;
                    console.log(post.content);
                    return post.content;
                });
            };
        } else {
            this.initializeEditorPromise = () => {
                return this.Promise.resolve('Add your content here.');
            };
            this.userRepository
                .current()
                .then((user) => {
                    context.user = user;
                });
        }
    }
}

register.viewControl('managepost-vc', ViewControl, [
    PostRepository,
    UserRepository,
    quillFactory,
    web.Browser
]);
