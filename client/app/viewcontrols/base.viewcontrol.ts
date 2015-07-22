/// <reference path="../../references.d.ts" />

import {acquire, async, ui} from 'platypus';

class BaseViewControl extends ui.ViewControl {
    protected _Promise = acquire(async.IPromise);
    protected _globalAlert = acquire('global-alert');
    protected _document = plat.acquire(plat.Document);
    protected scrollingContainer = this._document.querySelector('.blog-viewport-container');

    setTemplate() {
        this._scrollToTop();
    }

    protected _scrollToTop(): void {
        var scrollingContainer = this.scrollingContainer;
        if (this.utils.isNode(scrollingContainer)) {
            scrollingContainer.scrollTop = 0;
        }
    }
}

export = BaseViewControl;
