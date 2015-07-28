import {acquire, async, Document as _Document, ui} from 'platypus';

export default class BaseViewControl extends ui.ViewControl {
    protected Promise: async.IPromise = acquire(async.IPromise);
    protected globalAlert: any = acquire('global-alert');
    protected document: Document = acquire(_Document);
    protected scrollingContainer: HTMLElement = <HTMLElement>this.document.querySelector('.blog-viewport-container');

    setTemplate(): void {
        this.scrollToTop();
    }

    protected scrollToTop(): void {
        var scrollingContainer = this.scrollingContainer;
        if (this.utils.isNode(scrollingContainer)) {
            scrollingContainer.scrollTop = 0;
        }
    }
}
