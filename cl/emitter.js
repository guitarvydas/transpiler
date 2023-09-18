{
    Program: function(listOfForms) {return toSpaceDelimitedList(listOfForms.emitjs())},
    Arg: function(a) {return a.emitjs();},

    Form: function(item) {return item.emitjs()},
    SList: function(lis) {return lis.emitjs()},
    SList_atnewlistat: function(_begin,_at,items,_end) { return "list(" + items.emitjs() + ")"; },
    SList_atnewdottedlistat: function(_begin,_at,items,_end) { return "cons(" + toDotted(items.emitjs()) + ")"; },

    SpecialForm: function(e) { return e.emitjs(); },

    // CondExpression contains CondClauses (optional else clause)
    // CondClause contains Statements
    //
    // the first clause is emitted with "if"
    // subsequent (more) clauses are emitted with "} else if "
    //
    // statements are emitted suffixed by ':'
    // last statement is emitted as ' return ... ; '
    //
    CondExpression: function(c){ return c.emitjs(); },
    CondExpressionWithElse : function(_begin,_cond,firstClause,moreClauses,elseClause,_end) {
        return "(function(){<br>" + firstClause.emitjs() + toSpaceDelimitedList(moreClauses.emitjs()) + elseClause.emitjs() + "<br>})()" ; },
    CondExpressionWithoutElse : function(_begin,_cond,firstClause,moreClauses,_end) {
        return "(function(){<br>"+ firstClause.emitjs() + toSpaceDelimitedList(moreClauses.emitjs()) + " else " + "{<br>return null;<br>}" + "<br>})()" ; },

    FirstCondClause: function(c) { return "if " + c.emitjs(); },
    MoreCondClause: function(c) { return " else if " + c.emitjs(); },
    CondClause: function(_begin,ctest,block,_end) {return "(" + ctest.emitjs() + ") {<br>" +  block.emitjs() + "<br>}"; },

    CondTest: function(f) { return f.emitjs(); },
    CondElseClause: function(_begin,_else,block,_end){ return "else {<br>" + block.emitjs() + "}<br>"; },

    CondStatementBlock: function(sb) { return sb.emitjs(); },

    StatementBlock: function(atomOrSequential) { return atomOrSequential.emitjs(); },
    SequentialStatement: function(midStatements, lastStatement) {
	return toSpaceDelimitedList(midStatements.emitjs()) + lastStatement.emitjs()},
    MidStatement: function(s,_lookahead) { if (s._node.numChildren() > 0) {return s.emitjs() + ";<br>" ;} else {return "";}},
    LastStatement: function(s) { return "return " + s.emitjs() + ";<br>" ;},
    Statement: function(f) { return f.emitjs() ;},

    LetExpression: function(e) { return e.emitjs(); },
    LetSequential: function(_begin,_letstar,bindings,body,_end) {
	throw "NIY: let*";
	return "(function(" + bindings.emitjs() + ") {<br>"+ body.emitjs() + "<br>})()"},
    LetParallel: function(_begin,_let,bindings,body,_end) {
	return "(function(" + bindings.emitjs() + ") {<br>"+ body.emitjs() + "<br>})()"},

    LetBindings: function(_begin,bindings,_end) { return bindings.emitjs(); },
    Binding: function(_begin,v,e,_end) { return v.emitjs() + "=" + e.emitjs(); },
    LetVar: function(id) {return id.emitjs(); },
    LetBindingClause: function(e) { return e.emitjs(); },

    
    IfThenElseExpression: function(_begin,_if,e,thenPart,elsePart,_end) {
        return "(function(){<br>if (" + e.emitjs() + ") {<br>return " + thenPart.emitjs() + ";<br>} else {<br>return " + elsePart.emitjs() + ";<br>}<br>})()";
    },

    IfThenExpression: function(_begin,_if,e,thenPart,_end) {
        return "(function(){<br>if (" + e.emitjs() + ") {<br>return " + thenPart.emitjs() + ";<br>} else {<br>" + "  return null;" + "<br>}<br>})()";
    },

    ThenPart: function(b) { return b.emitjs(); },
    ElsePart: function(b) { return b.emitjs(); },

    AndExpression: function(_begin,_and,booleans,_end) {
	return toBranchingAnd(booleans.emitjs());},
    OrExpression: function(_begin,_and,booleans,_end) {
	return toBranchingOr(booleans.emitjs())},
    NotExpression: function(_begin,_not,bool,_end) { return "(!" + bool.emitjs() + ")"; },
    Bool: function(form){return form.emitjs(); },

    SetExpression: function (_begin,_set,v,e,_end) { return "(" + v.emitjs() + " = " + e.emitjs() + ")"; },
    SetVar: function (id) { return id.emitjs(); },
    SetExpr: function (e) { return e.emitjs(); },

    FunctionCall: function(_lp,id,actuals,_end) {return id.emitjs() + "(" + actuals.emitjs() + ")";},

    GlobalFunctionDefinition: function(_begin,_define,_begin2,id,formals,_end2,body,_end) {
	return "function " + id.emitjs() + "(" + formals.emitjs() + ")" + " {<br>" + body.emitjs() + "};<br>"; },

    GlobalVariableDefinition: function(_begin,_define,id,form,_end) {
	return "let " + id.emitjs() + " = " + form.emitjs() + ";<br>";},
    TopLevelFunctionCall: function(fn) {return fn.emitjs() + ";<br>";},
    


    DottedList: function(_lp, items, _dot, lastItem, _rp) { throw "can't happen (in this solution)"; },
    //DottedList: function(_lp, items, _dot, lastItem, _rp) { return toSpaceDelimitedList(items.emitjs()) + " . " + lastItem.emitjs(); },

    NullTerminatedList: function(_lp, items, _rp) {
	return toSpaceDelimitedList(items.emitjs()) ;},
    ListItem: function(item) {return item.emitjs()},

    Atom: function(a) {return a.emitjs() ;},

    QuotedExpression: function(x) {return x.emitjs();},
    QuotedSymbol: function(_lp,_q,sym,_rp){ return '"' + sym.emitjs() + '"'},
    QuotedOther: function(_lp,_q,sym,_rp){ return sym.emitjs()},
    lexical_QUOTE: function(_quote,_sp) {return "";},

    Identifier: function(id) {return id.emitjs();},
    END: function(_rp) {return "";},
    
    lexical_IF: function(_if,_sp) { return ""; },
    lexical_ELSE: function(_else,_sp) { return ""; },
    lexical_AND: function(_and,_sp) {return "";},
    lexical_OR: function(_or,_sp2) {return "";},
    lexical_NOT: function(_not,_sp) {return "";},
    lexical_AtNewListAt: function(_atnewlistat,_rp) { return "" ; },
    lexical_DEFINE: function(_,sp2){return "";},
    lexical_LETSTAR: function(_let,_sp2) { return ""; },
    lexical_LET: function(_let,_sp2) { return ""; },
    lexical_COND: function(_,_sp2){return "";},
    lexical_ELSE: function(_,_sp2){return "";},


    lexical_integer: function(ns) {return toPackedString(ns.emitjs());},
    lexical_symbol: function(c, cs) {return c.emitjs() + toPackedString(cs.emitjs());},
    lexical_string: function(_q1, chars, _q2) {return "\"" + toPackedString(chars.emitjs()) + "\""},
    lexical_letchar: function(c) {return c.emitjs()},
    lexical_numchar: function(c) {return c.emitjs()},
    lexical_lc: function(c) {return c.emitjs()},
    lexical_uc: function(c) {return c.emitjs()},

    lexical_boolean: function(b) {return ("#f" == this.sourceString) ? "false" : "true"; },
    _terminal: function() { return this.primitiveValue; }
}
);
