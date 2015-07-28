import {register} from 'platypus';
import * as moment from 'moment';

export function Moment(): typeof moment {
	return moment;
}

register.injectable('moment', Moment);
