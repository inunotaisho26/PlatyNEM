import {register} from 'platypus';
import PostRepository from '../../../../../repositories/post.repo';
import CMSBaseViewControl from '../../../base.vc';
import ManagePostViewControl from '../manage/manage.vc';

export default class ListPostsViewControl extends CMSBaseViewControl {
    title: string = 'List Blog Posts';
    templateString: string = require('./list.vc.html');
    context: {
        manageView: typeof ManagePostViewControl,
        posts: Array<models.IPost>;
        deleteModal: boolean;
    } = {
        manageView: ManagePostViewControl,
        posts: null,
        deleteModal: false
    };

    toDeleteId: string;

    constructor(private postRepository: PostRepository) {
        super();
    }

    navigatedTo(): void {
        this.refreshPosts();
    }

    toggleDeleteModal(id?: string): void {
        var context = this.context;
        context.deleteModal = !context.deleteModal;

        if (!this.utils.isNull(id)) {
            this.toDeleteId = id;
        }
    }

    refreshPosts(): void {
        this.postRepository.all().then((posts: Array<models.IPost>) => {
            this.context.posts = posts;
        });
    }

    confirmDelete(): void {
        this.postRepository.destroy(this.toDeleteId).then((result) => {
           this.toDeleteId = null;
           this.context.deleteModal = false;
           this.globalAlert.setAlerts('Post has been deleted', 'success');
           this.refreshPosts();
        });
    }
}

register.viewControl('adminlistposts-vc', ListPostsViewControl, [
    PostRepository
]);
