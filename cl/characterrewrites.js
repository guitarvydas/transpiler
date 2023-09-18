#!/usr/bin/env node
//'use strict'

const fs = require ('fs');

function characterRewrites(inputString) {
    var r = inputString
	.replace(/-/g,'_')
    ;
    return r;
}
      

var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
var output = characterRewrites (input);
console.log (output);
