{
    Sexprs: function (Sexpr) {
	_ruleEnter ("Sexprs");
	Sexpr = Sexpr.rwr ().join ('');

	_ruleExit ("Sexprs");
	return `${Sexpr}`;
    },
    Sexpr_list: function (lp,Sexpr,rp) {
	_ruleEnter ("Sexpr_list");
	lp = lp.rwr ();
	Sexpr = Sexpr.rwr ().join ('');
	rp = rp.rwr ();

	_ruleExit ("Sexpr_list");
	return `${lp}${Sexpr}${rp}`;
    },
    Sexpr_quoted: function (q,Sexpr) {
	_ruleEnter ("Sexpr_quoted");
	q = q.rwr ();
	Sexpr = Sexpr.rwr ();

	_ruleExit ("Sexpr_quoted");
	return `${q}${Sexpr}`;
    },
    Sexpr_symbol: function (Symbol) {
	_ruleEnter ("Sexpr_symbol");
	Symbol = Symbol.rwr ();

	_ruleExit ("Sexpr_symbol");
	return `${Symbol}`;
    },
    Symbol: function (symchar,vcomma) {
	_ruleEnter ("Symbol");
	symchar = symchar.rwr ().join ('');
	vcomma = vcomma.rwr ().join ('');

	_ruleExit ("Symbol");
	return `${symchar}${vcomma}`;
    },
    semiColonComment: function (ksemi,cs,nl) {
	_ruleEnter ("semiColonComment");
	ksemi = ksemi.rwr ();
	cs = cs.rwr ().join ('');
	nl = nl.rwr ();

	_ruleExit ("semiColonComment");
	return ``;
    },
    Sexpr_empty: function (q,lp,rp) {
	_ruleEnter ("Sexpr_empty");
	q = q.rwr ();
	lp = lp.rwr ();
	rp = rp.rwr ();

	_ruleExit ("Sexpr_empty");
	return `(emptylist)`;
    },

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

