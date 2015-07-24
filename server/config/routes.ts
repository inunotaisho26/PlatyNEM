/**
 * For routes, all POST/PUT/DELETE methods will always have
 * the session information on them.
 *
 * For GET methods you need to manually populate session information
 * as well as do any sort of authentication if necessary.
 */

import {Router} from 'express';
import * as auth from '../middleware/auth.mw';
import user from '../controllers/user.ctrl';
import post from '../controllers/post.ctrl';

var configure = (baseRoute: string, router: Router): Router => {
    router .route(baseRoute + '/*')
        .put(auth.requiresLogin)
        .delete(auth.requiresLogin, auth.isAdmin);

    user.initialize(baseRoute + '/users', router);
    post.initialize(baseRoute + '/posts', router);

    return router;
};

export default configure;
