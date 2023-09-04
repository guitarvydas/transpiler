#!/usr/bin/env node
//'use strict'

// Ohm-JS as a command-line command
//
// an Ohm-JS application consists of 2 operations in sequence
// 1. pattern match
// 2. if the pattern match was successful, then tree-walk the result and apply semantics

const fs = require ('fs');
const ohm = require ('ohm-js');

let argv;

function patternMatch (src, grammarName, grammarText) {
    // return { success, OhmJS "grammar object", error }
    // OhmJS converts the text for the grammar into an internal data structure,
    //  that internal data structure is needed for later operations
    // grammarText contains multiple grammars in textual format
    // grammarName is used to select only one of the grammars, for matching
    //
    // the use-case for multiple grammars is, most often, the fact that a grammar
    //  can inherit from other grammars
    //
    let grammars = undefined;
    let ohmGrammarObject = undefined;
    let emessage = '';
    try {
	grammars = ohm.grammars (grammarText);
	ohmGrammarObject = grammars [grammarName];
    } catch (err) {
	emessage = err.message;
	return [false, undefined, `\nerror in grammar ${emessage}`];
    }

    let matchResult;
    try {
	matchResult = ohmGrammarObject.match (src);
    } catch (err) {
	return [false, undefined, err.message];
    }
    if (matchResult.failed ()) {
	return [false, ohmGrammarObject, matchResult.message];
    } else { 
	return [true, ohmGrammarObject, ""];
    }
}

function applySemantics (ohmGrammarObject, rwrFileName, supportFileName) {
    let semanticsFunctionsAsString;
    let evalableSemanticsFunctions;
    let ohmSemanticsObject;
    try {
	semanticsFunctionsAsString = fs.readFileSync (rwrFileName, 'utf-8');
	console.log (semanticsFunctionsAsString);
	// let evalableSemanticsFunctions = '(' + semanticsFunctionsAsString + ')';
	// let ohmSemanticsObject = ohmGrammarObject.createSemantics ();
    } catch (e) {
	console.error (e.message);
	process.exit (1);
    }
}


/////


function main () {
    try {
	argv = require('yargs/yargs')(process.argv.slice(2)).argv;

	let grammarName = argv._[0];
	let grammarFileName = argv._[1];
	let rwrFileName = argv._[2];
	let supportFileName = argv._[3];
	let src = fs.readFileSync ('/dev/fd/0', 'utf-8');

	let grammar = fs.readFileSync (grammarFileName, 'utf-8');
	let rwr = fs.readFileSync (rwrFileName, 'utf-8');

	let r;
	r = patternMatch (src, grammarName, grammar);
	let success = r [0]
	let ohmGrammarObject = r [1]
	let errormessage = r [2]
	if (success) {
	    r = applySemantics (ohmGrammarObject, rwrFileName, supportFileName);
	    process.exit (0);
	} else {
	    console.error (errormessage);
	    process.exit (1);
	}
    } catch (e) {
	console.error (e.message);
	process.exit (1);
    }
}

main ()
