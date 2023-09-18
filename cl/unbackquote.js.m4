_ = {
    toSpaceDelimitedList: function (a) { return a.join(' '); },
    toPackedString: function (a) { return a.join(''); }
},

{
    Program: function(tree) {return _.toSpaceDelimitedList(tree.rwr())},
    Form: function(item) {return item.rwr()},
    QuotedSexp: function(_, form) {return "(quote " + form.rwr() + ")"},
    BackQuotedSexp: function(_, form) {return form.inbackquote();},
    CommaSexp: function(_, form) {throw "can\'t happen - comma not inside backquote - (actually, not necessarily the case, but nested backquotes left as an exercise for the reader)"},
    SList: function(lis) {return lis.rwr()},
    DottedList: function(_lp, items, _dot, lastItem, _rp) {
	return "(" + _.toSpaceDelimitedList(items.rwr()) + " . " + lastItem.rwr() + ")"},
    NullTerminatedList: function(_lp, items, _rp) {
	return "(" + _.toSpaceDelimitedList(items.rwr()) + ")"},
    ListItem: function(item) {return item.rwr()},
    Atom: function(a) {return a.rwr()},
    lexical_integer: function(ns) {return _.toPackedString(ns.rwr());},
    lexical_symbol: function(c, cs) {return c.rwr() + _.toPackedString(cs.rwr());},
    lexical_string: function(_q1, chars, _q2) {return "\"" + _.toPackedString(chars.rwr()) + "\""},
    lexical_letchar: function(c) {return c.rwr()},
    lexical_numchar: function(c) {return c.rwr()},
    lexical_lc: function(c) {return c.rwr()},
    lexical_uc: function(c) {return c.rwr()},
    
    lexical_boolean: function(b) {return this.sourceString},
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
}
