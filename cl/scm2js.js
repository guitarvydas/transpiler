
_ = {
    toDotted: function (a) { return a.join(','); },
    toBranchingAnd: function (a) { return a.join(' && '); },
    toBranchingOr: function (a) { return a.join(' || '); },
    toPackedString: function (a) { return a.join(''); },
    toSpaceDelimitedList: function (a) { return a.join(' '); },
},

{
    Program: function(listOfForms) {return _.toSpaceDelimitedList(listOfForms.rwr())},
    Arg: function(a) {return a.rwr();},

    Form: function(item) {return item.rwr()},
    SList: function(lis) {return lis.rwr()},
    SList_atnewlistat: function(_begin,_at,items,_end) { return "list(" + items.rwr() + ")"; },
    SList_atnewdottedlistat: function(_begin,_at,items,_end) { return "cons(" + _.toDotted(items.rwr()) + ")"; },

    SpecialForm: function(e) { return e.rwr(); },

    // CondExpression contains CondClauses (optional else clause)
    // CondClause contains Statements
    //
    // the first clause is emitted with "if"
    // subsequent (more) clauses are emitted with "} else if "
    //
    // statements are emitted suffixed by ':'
    // last statement is emitted as ' return ... ; '
    //
    CondExpression: function(c){ return c.rwr(); },
    CondExpressionWithElse : function(_begin,_cond,firstClause,moreClauses,elseClause,_end) {
        return "(function(){\n" + firstClause.rwr() + _.toSpaceDelimitedList(moreClauses.rwr()) + elseClause.rwr() + "\n})()" ; },
    CondExpressionWithoutElse : function(_begin,_cond,firstClause,moreClauses,_end) {
        return "(function(){\n"+ firstClause.rwr() + _.toSpaceDelimitedList(moreClauses.rwr()) + " else " + "{\nreturn null;\n}" + "\n})()" ; },

    FirstCondClause: function(c) { return "if " + c.rwr(); },
    MoreCondClause: function(c) { return " else if " + c.rwr(); },
    CondClause: function(_begin,ctest,block,_end) {return "(" + ctest.rwr() + ") {\n" +  block.rwr() + "\n}"; },

    CondTest: function(f) { return f.rwr(); },
    CondElseClause: function(_begin,_else,block,_end){ return "else {\n" + block.rwr() + "}\n"; },

    CondStatementBlock: function(sb) { return sb.rwr(); },

    StatementBlock: function(atomOrSequential) { return atomOrSequential.rwr(); },
    SequentialStatement: function(midStatements, lastStatement) {
	return _.toSpaceDelimitedList(midStatements.rwr()) + lastStatement.rwr()},
    MidStatement: function(s,_lookahead) { if (s._node.numChildren() > 0) {return s.rwr() + ";\n" ;} else {return "";}},
    LastStatement: function(s) { return "return " + s.rwr() + ";\n" ;},
    Statement: function(f) { return f.rwr() ;},

    LetExpression: function(e) { return e.rwr(); },
    LetSequential: function(_begin,_letstar,bindings,body,_end) {
	throw "NIY: let*";
	return "(function(" + bindings.rwr() + ") {\n"+ body.rwr() + "\n})()"},
    LetParallel: function(_begin,_let,bindings,body,_end) {
	return "(function(" + bindings.rwr() + ") {\n"+ body.rwr() + "\n})()"},

    LetBindings: function(_begin,bindings,_end) { return bindings.rwr(); },
    Binding: function(_begin,v,e,_end) { return v.rwr() + "=" + e.rwr(); },
    LetVar: function(id) {return id.rwr(); },
    LetBindingClause: function(e) { return e.rwr(); },

    
    IfThenElseExpression: function(_begin,_if,e,thenPart,elsePart,_end) {
        return "(function(){\nif (" + e.rwr() + ") {\nreturn " + thenPart.rwr() + ";\n} else {\nreturn " + elsePart.rwr() + ";\n}\n})()";
    },

    IfThenExpression: function(_begin,_if,e,thenPart,_end) {
        return "(function(){\nif (" + e.rwr() + ") {\nreturn " + thenPart.rwr() + ";\n} else {\n" + "  return null;" + "\n}\n})()";
    },

    ThenPart: function(b) { return b.rwr(); },
    ElsePart: function(b) { return b.rwr(); },

    AndExpression: function(_begin,_and,booleans,_end) {
	return _.toBranchingAnd(booleans.rwr());},
    OrExpression: function(_begin,_and,booleans,_end) {
	return _.toBranchingOr(booleans.rwr())},
    NotExpression: function(_begin,_not,bool,_end) { return "(!" + bool.rwr() + ")"; },
    Bool: function(form){return form.rwr(); },

    SetExpression: function (_begin,_set,v,e,_end) { return "(" + v.rwr() + " = " + e.rwr() + ")"; },
    SetVar: function (id) { return id.rwr(); },
    SetExpr: function (e) { return e.rwr(); },

    FunctionCall: function(_lp,id,actuals,_end) {return id.rwr() + "(" + actuals.rwr() + ")";},

    GlobalFunctionDefinition: function(_begin,_define,_begin2,id,formals,_end2,body,_end) {
	return "function " + id.rwr() + "(" + formals.rwr() + ")" + " {\n" + body.rwr() + "};\n"; },

    GlobalVariableDefinition: function(_begin,_define,id,form,_end) {
	return "let " + id.rwr() + " = " + form.rwr() + ";\n";},
    TopLevelFunctionCall: function(fn) {return fn.rwr() + ";\n";},
    


    DottedList: function(_lp, items, _dot, lastItem, _rp) { throw "can't happen (in this solution)"; },
    //DottedList: function(_lp, items, _dot, lastItem, _rp) { return _.toSpaceDelimitedList(items.rwr()) + " . " + lastItem.rwr(); },

    NullTerminatedList: function(_lp, items, _rp) {
	return _.toSpaceDelimitedList(items.rwr()) ;},
    ListItem: function(item) {return item.rwr()},

    Atom: function(a) {return a.rwr() ;},

    QuotedExpression: function(x) {return x.rwr();},
    QuotedSymbol: function(_lp,_q,sym,_rp){ return '"' + sym.rwr() + '"'},
    QuotedOther: function(_lp,_q,sym,_rp){ return sym.rwr()},
    lexical_QUOTE: function(_quote,_sp) {return "";},

    Identifier: function(id) {return id.rwr();},
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


    lexical_integer: function(ns) {return _.toPackedString(ns.rwr());},
    lexical_symbol: function(c, cs) {return c.rwr() + _.toPackedString(cs.rwr());},
    lexical_string: function(_q1, chars, _q2) {return "\"" + _.toPackedString(chars.rwr()) + "\""},
    lexical_letchar: function(c) {return c.rwr()},
    lexical_numchar: function(c) {return c.rwr()},
    lexical_lc: function(c) {return c.rwr()},
    lexical_uc: function(c) {return c.rwr()},

    lexical_boolean: function(b) {return ("#f" == this.sourceString) ? "false" : "true"; },

    _terminal: function() { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); }
}
