import {acquire, async, ui, Document as _Document} from 'platypus';

export default class CMSBaseViewControl extends ui.ViewControl {
    protected Promise: async.IPromise = acquire(async.IPromise);
    protected document: Document = acquire(_Document);
    protected globalAlert: any = acquire('global-alert');
}
