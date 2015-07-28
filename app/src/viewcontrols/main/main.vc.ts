import {routing, register} from 'platypus';
import BaseViewControl from '../base.vc';
import ListPostsViewControl from '../posts/list/list.vc';
import SinglePostViewControl from '../posts/single/single.vc';

export default class PublicViewControl extends BaseViewControl {
    templateString: string = require('./main.vc.html');
    context: {} = {};
    constructor(router: routing.Router) {
        super();

        router.configure([
            { pattern: '', view: ListPostsViewControl },
            { pattern: 'posts/:slug', view: SinglePostViewControl }
        ]);
    }
}

register.viewControl('public-vc', PublicViewControl, [
    routing.Router
]);
