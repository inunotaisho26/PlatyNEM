/// <reference path="../../references.d.ts" />

import plat = require('platypus');
import AdminViewControl = require('../viewcontrols/admin/main.viewcontrol');
import PublicViewControl = require('../viewcontrols/public/main.viewcontrol');
import UserRepository = require('../repositories/user.repository');
import Helpers = require('../common/injectables/helpers.injectable');

export class App extends plat.App {
    constructor(router: plat.routing.Router,
        config: plat.web.IBrowserConfig,
        repository: UserRepository,
        private helpers: Helpers,
        private utils: plat.Utils,
        private browser: plat.web.Browser) {
        super();

        router.configure([
            { pattern: '', view: PublicViewControl },
            { pattern: 'admin', view: AdminViewControl },
        ]);

        config.routingType = config.STATE;

        router.intercept((info) => {
            return repository.isAdmin();
        }, AdminViewControl);
    }

    ready(ev: plat.events.LifecycleEvent) {
        var defer = this.utils.defer;

        this.on('urlChanged', (ev: plat.events.DispatchEvent, utils?: plat.web.UrlUtils) => {
            this.clearScripts();

            defer(() => {
                this.doTracking(utils.pathname);
            }, 2000)
        });

        this.clearScripts();

        var utils = this.browser.urlUtils();

        defer(() => {
            this.doTracking(utils.pathname);
        }, 2000);
    }

    error(ev: plat.events.ErrorEvent<Error>) {
        var stack: string = (<any>ev.error).stack;

        if (!stack) {
            stack = '';
        }

        if (!!(<any>window).ga) {
            var description = ev.error.message + stack;

            description = description.slice(0, 100);
            (<any>window).ga('send', 'exception', {
               exDescription: description
            });
        }
    }

    doTracking(path: string) {
        path = this.normalizePath(path);

        if (!!(<any>window).ga) {
            (<any>window).ga('send', 'pageview', {
               page: path
            });
        }
    }

    normalizePath(path: string) {
        if (path[0] !== '/') {
            path = '/' + path;
        }

        return path;
    }

    clearScripts() {
        var helpers = this.helpers;

        helpers.removeScript('www.google-analytics.com');
    }
}

plat.register.app('depot', App, [
    plat.routing.Router,
    plat.web.IBrowserConfig,
    UserRepository,
    Helpers,
    plat.Utils,
    plat.web.Browser
]);
