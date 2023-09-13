#!/usr/bin/env node
//'use strict'

const fs = require ('fs');

function rewrites(inputString) {
    var r = inputString
	.replace(/,\)/g,')')
	.replace(/\( /g,'(')
	.replace(/ₓ/g,'')
	.replace(/‡/g,',')
	.replace(/†/g,',')
    ;
    return r;
}
      

var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
var output = rewrites (input);
console.log (output);
