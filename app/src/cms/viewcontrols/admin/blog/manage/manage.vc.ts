import {async, controls, register} from 'platypus';
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
    } = {
        post: {
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

    navigatedTo(params: any): void {
        var context = this.context;

        if (!isNaN(Number(params.id))) {
            this.initializeEditorPromise = () => {
                return this.postRepository
                .read(params.id)
                .then((post) => {
                    context.post = post;
                    return post.content;
                });
            };
        } else {
            this.initializeEditorPromise = () => {
                return this.Promise.resolve('');
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
    quillFactory
]);
