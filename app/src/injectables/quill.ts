import {register} from 'platypus';
var quill = require('quill');

export default function quillFactory() {
	return quill;
}

register.injectable('quillFactory', quillFactory, null, register.injectable.STATIC);
