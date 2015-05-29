/// <reference path="../../../references.d.ts" />

import {register} from 'platypus';
import * as moment from 'moment';

export function Moment() {
	return moment;
}

register.injectable('moment', Moment);
