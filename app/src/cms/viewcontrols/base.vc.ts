import {acquire, async, ui, Document} from 'platypus';

export default class CMSBaseViewControl extends ui.ViewControl {
    protected _Promise = acquire(async.IPromise);
    protected _document = plat.acquire(Document);
    protected _globalAlert = acquire('global-alert');
}
