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
Sexpr_beginconstantlist: function (lp,q,sexpr,rp) {
_ruleEnter ("Sexpr_beginconstantlist");
lp = lp.rwr ();
q = q.rwr ();
sexpr = sexpr.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_beginconstantlist");
return `${sexpr}`;
},
CSexpr_constantlist: function (lp,Sexprs,rp) {
_ruleEnter ("CSexpr_constantlist");
lp = lp.rwr ();
Sexprs = Sexprs.rwr ().join ('');
rp = rp.rwr ();

_ruleExit ("CSexpr_constantlist");
return `(constant-list ${Sexprs})`;
},
CSexpr_constantstring: function (k) {
_ruleEnter ("CSexpr_constantstring");
k = k.rwr ();

_ruleExit ("CSexpr_constantstring");
return `(constant-string "${k}")`;
},
CSexpr_constantinteger: function (k) {
_ruleEnter ("CSexpr_constantinteger");
k = k.rwr ();

_ruleExit ("CSexpr_constantinteger");
return `(constant-integer "${k}")`;
},
CSexpr_constantsymbol: function (k) {
_ruleEnter ("CSexpr_constantsymbol");
k = k.rwr ();

_ruleExit ("CSexpr_constantsymbol");
return `(constant-symbol "${k}")`;
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

