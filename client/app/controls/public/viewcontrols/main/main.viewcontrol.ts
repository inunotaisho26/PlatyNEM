import {routing, register} from 'platypus';
import BaseViewControl from '../base.viewcontrol';
import ListPostsViewControl from '../posts/list/list.viewcontrol';
import SinglePostViewControl from '../posts/single/single.viewcontrol';

export default class PublicViewControl extends BaseViewControl {
    templateString = require('./main.viewcontrol.html');
    context = {};
    constructor(router: routing.Router) {
        super();

        router.configure([
            { pattern: '', view: ListPostsViewControl },
            { pattern: 'posts/:id', view: SinglePostViewControl }
        ]);
    }
}

register.viewControl('public-vc', PublicViewControl, [
    routing.Router
]);

