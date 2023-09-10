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
string: function (dq1,cs,dq2) {
_ruleEnter ("string");
dq1 = dq1.rwr ();
cs = cs.rwr ().join ('');
dq2 = dq2.rwr ();

_ruleExit ("string");
return `${dq1}${cs}${dq2}`;
},
number: function (ds,vcomma) {
_ruleEnter ("number");
ds = ds.rwr ().join ('');
vcomma = vcomma.rwr ().join ('');

_ruleExit ("number");
return `${ds}${vcomma}`;
},
semiColonComment: function (ksemi,cs,nl) {
_ruleEnter ("semiColonComment");
ksemi = ksemi.rwr ();
cs = cs.rwr ().join ('');
nl = nl.rwr ();

_ruleExit ("semiColonComment");
return ``;
},
Symbol: function (x) {
_ruleEnter ("Symbol");
x = x.rwr ();

_ruleExit ("Symbol");
return `${x}`;
},
Symbol_true: function (k) {
_ruleEnter ("Symbol_true");
k = k.rwr ();

_ruleExit ("Symbol_true");
return `trueₓ`;
},
Symbol_false: function (k) {
_ruleEnter ("Symbol_false");
k = k.rwr ();

_ruleExit ("Symbol_false");
return `falseₓ`;
},
Symbol_isPair: function (k) {
_ruleEnter ("Symbol_isPair");
k = k.rwr ();

_ruleExit ("Symbol_isPair");
return `isPairₓ`;
},
Symbol_rBang: function (k) {
_ruleEnter ("Symbol_rBang");
k = k.rwr ();

_ruleExit ("Symbol_rBang");
return `rBangₓ`;
},
Symbol_isForeign: function (k) {
_ruleEnter ("Symbol_isForeign");
k = k.rwr ();

_ruleExit ("Symbol_isForeign");
return `isForeignₓ`;
},
Symbol_isVar: function (k) {
_ruleEnter ("Symbol_isVar");
k = k.rwr ();

_ruleExit ("Symbol_isVar");
return `isVarₓ`;
},
Symbol_isEmptyList: function (k) {
_ruleEnter ("Symbol_isEmptyList");
k = k.rwr ();

_ruleExit ("Symbol_isEmptyList");
return `isEmptyListₓ`;
},
Symbol_mutate: function (k) {
_ruleEnter ("Symbol_mutate");
k = k.rwr ();

_ruleExit ("Symbol_mutate");
return `mutateₓ`;
},
Symbol_eStar: function (k) {
_ruleEnter ("Symbol_eStar");
k = k.rwr ();

_ruleExit ("Symbol_eStar");
return `eStarₓ`;
},
Symbol_other: function (c,vcomma) {
_ruleEnter ("Symbol_other");
c = c.rwr ().join ('');
vcomma = vcomma.rwr ().join ('');

_ruleExit ("Symbol_other");
return `${c}${vcomma}`;
},
sym: function (s,vcomma) {
_ruleEnter ("sym");
s = s.rwr ();
vcomma = vcomma.rwr ().join ('');

_ruleExit ("sym");
return `${s}${vcomma}`;
},

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

