#!/usr/bin/env node
//'use strict'

const fs = require ('fs');
const ohm = require ('ohm-js');

var grammarText = String.raw`
Scm {
  Program = Form+
  Form = SList | Atom
  QuotedSexp = "'" Form
  BackQuotedSexp = "\x60" Form
  CommaSexp = "," Form
  SList = DottedList | NullTerminatedList
  DottedList = "(" ListItem+ lexical_DOT ListItem ")"
  NullTerminatedList =   "(" ListItem* ")"
  ListItem = (Atom | SList)
  Atom = lexical_atom | Syntactic_Atom
  Syntactic_Atom = QuotedSexp | BackQuotedSexp | CommaSexp

  lexical_atom = lexical_integer | lexical_symbol | lexical_string | lexical_boolean
  lexical_boolean = "#f" | "#t"
  lexical_integer = lexical_numchar+
  lexical_numchar = "0".."9"
  lexical_string = "\"" (~"\"" any)+ "\""
  lexical_symbol = lexical_letchar (lexical_letchar | lexical_numchar)*
  lexical_letchar = lexical_lc | lexical_uc | "+" | "*" | "!" | "?"  | "_" | "-" | "="
  lexical_lc = "a".."z"
  lexical_uc = "A".."Z"
  lexical_DOT = space* "." space*
  semiColonComment = ";" (~"\n" any)* "\n"
  space += semiColonComment
}
`;


var identity_sem =
    {
	Program: function(tree) {return toSpaceDelimitedList(tree.identity())},
	Form: function(item) {return item.identity()},
	QuotedSexp: function(_, form) {return "'" + form.identity()},
	BackQuotedSexp: function(_, form) {return "`" + form.identity()},
	CommaSexp: function(_, form) {return "," + form.identity()},
	SList: function(lis) {return lis.identity()},
	DottedList: function(_lp, items, _dot, lastItem, _rp) {
	    return "(" + toSpaceDelimitedList(items.identity()) + " . " + lastItem.identity() + ")"},
	NullTerminatedList: function(_lp, items, _rp) {
	    return "(" + toSpaceDelimitedList(items.identity()) + ")"},
	ListItem: function(item) {return item.identity()},
	Atom: function(a) {return a.identity()},
	lexical_integer: function(ns) {return toPackedString(ns.identity());},
	lexical_symbol: function(c, cs) {return c.identity() + toPackedString(cs.identity());},
	lexical_string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.identity()) + "\""},
	lexical_letchar: function(c) {return c.identity()},
	lexical_numchar: function(c) {return c.identity()},
	lexical_lc: function(c) {return c.identity()},
	lexical_uc: function(c) {return c.identity()},

	lexical_boolean: function(b) {return this.sourceString},
	_terminal: function() { return this.sourceString; },
	_iter: function (...children) { return children.map(c => c.identity ()); }
    };



var unbq_sem =
    {
	Program: function(tree) {return toSpaceDelimitedList(tree.unbackquote())},
	Form: function(item) {return item.unbackquote()},
	QuotedSexp: function(_, form) {return "(quote " + form.unbackquote() + ")"},
	BackQuotedSexp: function(_, form) {return form.inbackquote();},
	CommaSexp: function(_, form) {throw "can\'t happen - comma not inside backquote - (actually, not necessarily the case, but nested backquotes left as an exercise for the reader)"},
	SList: function(lis) {return lis.unbackquote()},
	DottedList: function(_lp, items, _dot, lastItem, _rp) {
	    return "(" + toSpaceDelimitedList(items.unbackquote()) + " . " + lastItem.unbackquote() + ")"},
	NullTerminatedList: function(_lp, items, _rp) {
	    return "(" + toSpaceDelimitedList(items.unbackquote()) + ")"},
	ListItem: function(item) {return item.unbackquote()},
	Atom: function(a) {return a.unbackquote()},
	lexical_integer: function(ns) {return toPackedString(ns.unbackquote());},
	lexical_symbol: function(c, cs) {return c.unbackquote() + toPackedString(cs.unbackquote());},
	lexical_string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.unbackquote()) + "\""},
	lexical_letchar: function(c) {return c.unbackquote()},
	lexical_numchar: function(c) {return c.unbackquote()},
	lexical_lc: function(c) {return c.unbackquote()},
	lexical_uc: function(c) {return c.unbackquote()},

	lexical_boolean: function(b) {return this.sourceString},
	_terminal: function() { return this.sourceString; },
	_iter: function (...children) { return children.map(c => c.unbackquote ()); }
    };

var inbq_sem =
    {
	Program: function(tree) {throw "can\'t happen"},
	Form: function(item) {return item.inbackquote()},
	QuotedSexp: function(_, form) {return "(quote " + form.inbackquote() + ")"},
	BackQuotedSexp: function(_, form) {throw "can\'t happen - left as exercise to the reader";},
	CommaSexp: function(_, form) {return form.identity()}, // use unbackquote to get eval'ed value
	SList: function(lis) {return lis.inbackquote()},
	DottedList: function(_lp, items, _dot, lastItem, _rp) {
	    return "(list " + toSpaceDelimitedList(items.inbackquote()) + " . " + lastItem.inbackquote() + ")"},
	NullTerminatedList: function(_lp, items, _rp) {
	    return "(list " + toSpaceDelimitedList(items.inbackquote()) + ")"},
	ListItem: function(item) {return item.inbackquote()},
	Atom: function(a) {return a.inbackquote()},
	lexical_integer: function(ns) {return toPackedString(ns.inbackquote());},
	lexical_symbol: function(c, cs) {return "(quote " + c.inbackquote() + toPackedString(cs.inbackquote()) + ")";},
	lexical_string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.inbackquote()) + "\""},
	lexical_letchar: function(c) {return c.inbackquote()},
	lexical_numchar: function(c) {return c.inbackquote()},
	lexical_lc: function(c) {return c.inbackquote()},
	lexical_uc: function(c) {return c.inbackquote()},

	lexical_boolean: function(b) {return this.sourceString},
	_terminal: function() { return this.sourceString; },
	_iter: function (...children) { return children.map(c => c.inbackquote ()); }
    };


function unbq (s) {
    let grammar = ohm.grammar (grammarText);
    let semantics = grammar.createSemantics();
    semantics.addOperation('identity', identity_sem);
    semantics.addOperation('unbackquote', unbq_sem);
    semantics.addOperation('inbackquote', inbq_sem);
    let parsed = grammar.match(s);
    return semantics(parsed).unbackquote();
    }

    
    function toSpaceDelimitedList (a) { return a.join(' '); }
    function toPackedString (a) { return a.join(''); }

    // the command-line code

    var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
    var output = unbq (input);
    console.log (output);
    

