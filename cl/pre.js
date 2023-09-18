#!/usr/bin/env node
//'use strict'

const fs = require ('fs');

function doPreReplacements(inputString) {
    var r = inputString
	.replace(/string[?]/g,"string_Q_")
	.replace(/string=[?]/g,"string_EQ_Q_")
    
        .replace(/foreign[?]/g,"foreign_Q_")
        .replace(/call-foreign/g,"call_foreign")
        .replace(/resolved-args/g,"resolved_args")
    
	.replace(/'!/g,'"!"')
	.replace(/[(][+]/g,"(_plus ")
	.replace(/null[?]/g,"null_Q_")
	.replace(/pair[?]/g,"pair_Q_")
	.replace(/e[*]/g,"e_A_")
	.replace(/car[!]/g,"car_B_")
	.replace(/var[?]/g,"var_Q_")
	.replace(/eqv[?]/g,"eqv_Q_")
	.replace(/eq[?]/g,"eq_Q_")
	.replace(/set-car/g,"set_car")
	.replace(/lookup-loop/g,"lookup_loop")
	.replace(/whole-db/g,"whole_db")
	.replace(/try/g,"_try")
    
	.replace(/print-frame/g,"print_frame")
    
    ;
    return r;
}

var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
var output = doPreReplacements (input);
console.log (output);
