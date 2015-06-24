/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import BlogViewControl = require('../viewcontrols/blog/main.viewcontrol');
import AdminViewControl = require('../viewcontrols/admin/main.viewcontrol');
import ToolsViewControl = require('../viewcontrols/tools/main.viewcontrol');
import UserRepository = require('../repositories/user.repository');

export class App extends plat.App {
    constructor(router: plat.routing.Router,
        config: plat.web.IBrowserConfig,
        repository: UserRepository) {
        super();

        router.configure([
            { pattern: '', view: BlogViewControl },
            { pattern: 'admin', view: AdminViewControl },
            { pattern: 'tools', view: ToolsViewControl }
        ]);

        config.routingType = config.STATE;

        router.intercept((info) => {
            return repository.isAdmin();
        }, AdminViewControl);
    }
}

plat.register.app('depot', App, [
    plat.routing.Router,
    plat.web.IBrowserConfig,
    UserRepository
]);
