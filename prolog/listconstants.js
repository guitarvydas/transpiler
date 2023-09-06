_ = {
    toSpaceDelimitedList: function (a) { return a.join(' '); },
    toPackedString: function (a) { return a.join(''); }
},

{
    Program: function(tree) {return _.toSpaceDelimitedList(tree.rwr())},
    Form: function(item) {return item.rwr()},
    SList: function(lis) {return lis.rwr();},
    QuotedSexp: function(_lp,_q,form,_rp) {return form.rwr()},
    BackQuotedSexp: function(_, form) {throw "can't happen";},
    CommaSexp: function(_, form) {throw "can't happen";},
    DottedList: function(_lp, items, _dot, lastItem, _rp) { throw "this solution does not support dotted list (except when quoted)"},
    NullTerminatedList: function(_lp, items, _rp) {
	return "(" + _.toSpaceDelimitedList(items.rwr()) + ")"},
    ListItem: function(item) {return item.rwr()},
    Atom: function(a) {return a.rwr()},
    Syntactic_Atom: function(a) { return a.rwr();},

    QuotedSList: function(slist) { return slist.rwr(); },
    QuotedNullTerminatedList: function(_lp,qitem,_rp) { return "(@newList@ " + _.toSpaceDelimitedList(qitem.rwr()) + ")"; },
    QuotedDottedList: function(_lp, items, _dot, lastItem, _rp) {
	return "(@newDottedList@ " + _.toSpaceDelimitedList(items.rwr()) + " " + lastItem.rwr() + ")"},
    QListItem: function(item) { return item.rwr(); },
    QAtom: function(a) { return a.rwr(); },
    QAtomicNonSymbol: function(a) { return a.rwr(); },
    QAtomicSymbol: function(a) { return '"' + a.rwr() + '"'; },

    lexical_QUOTE: function(_sp1,_q,_sp2) {return "";},

    lexical_atom: function(a) {return a.rwr(); },
    lexical_boolean: function(b) {return this.sourceString},
    lexical_integer: function(ns) {return _.toPackedString(ns.rwr());},
    lexical_numchar: function(c) {return c.rwr()},
    lexical_string: function(_q1, chars, _q2) {return "\"" + _.toPackedString(chars.rwr()) + "\""},
    lexical_symbol: function(c, cs) {return c.rwr() + _.toPackedString(cs.rwr());},
    lexical_letchar: function(c) {return c.rwr()},
    lexical_lc: function(c) {return c.rwr()},
    lexical_uc: function(c) {return c.rwr()},

    _terminal: function() { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); }
}
