/// <reference path="../../references.d.ts" />

import {acquire, async, ui} from 'platypus';

class BaseViewControl extends ui.ViewControl {
    protected _Promise = acquire(async.IPromise);
    protected _globalAlert = acquire('global-alert');
}

export = BaseViewControl;
