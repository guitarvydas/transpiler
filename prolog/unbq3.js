

var identity_sem =
    {
	Program: function(tree) {return toNewlineDelimitedList(tree.identity())},
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
	integer: function(ns) {return toPackedString(ns.identity());},
	symbol: function(c, cs) {return c.identity() + toPackedString(cs.identity());},
	string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.identity()) + "\""},
	letchar: function(c) {return c.identity()},
	numchar: function(c) {return c.identity()},
	lc: function(c) {return c.identity()},
	uc: function(c) {return c.identity()},

	boolean: function(b) {return this.sourceString},
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
	integer: function(ns) {return toPackedString(ns.unbackquote());},
	symbol: function(c, cs) {return c.unbackquote() + toPackedString(cs.unbackquote());},
	string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.unbackquote()) + "\""},
	letchar: function(c) {return c.unbackquote()},
	numchar: function(c) {return c.unbackquote()},
	lc: function(c) {return c.unbackquote()},
	uc: function(c) {return c.unbackquote()},

	boolean: function(b) {return this.sourceString},
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
	integer: function(ns) {return toPackedString(ns.inbackquote());},
	symbol: function(c, cs) {return "(quote " + c.inbackquote() + toPackedString(cs.inbackquote()) + ")";},
	string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.inbackquote()) + "\""},
	letchar: function(c) {return c.inbackquote()},
	numchar: function(c) {return c.inbackquote()},
	lc: function(c) {return c.inbackquote()},
	uc: function(c) {return c.inbackquote()},

	boolean: function(b) {return this.sourceString},
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

    
function toNewlineDelimitedList (a) { return a.join(' XXX '); }
function toSpaceDelimitedList (a) { return a.join(' '); }
function toPackedString (a) { return a.join(''); }

    // the command-line code

var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
var output = unbq (input);
console.log (output);
