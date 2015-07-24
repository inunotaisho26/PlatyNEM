import {resolve} from 'path';
import * as multer from 'multer';
import {root} from '../config/global';

var m: any = multer({
    dest: resolve(root, 'app/images/tmp'),
    onError(err?: any, next?: Function) {
        console.log(err);
        next();
    }
});

export default m;
