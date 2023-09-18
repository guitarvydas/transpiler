#!/usr/bin/env node
//'use strict'

const fs = require ('fs');

function doPostReplacements(inputString) {
    var r = inputString
	.replace(/[(]r!,/g,'("r!",')
        .replace(/set!/g,"set_B_")
    ;
    return r;
}
      

var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
var output = doPostReplacements (input);
console.log (output);
