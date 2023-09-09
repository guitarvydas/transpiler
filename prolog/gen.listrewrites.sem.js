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
Sexpr_define: function (lp,k,lp2,name,formals,rp2,body,rp) {
_ruleEnter ("Sexpr_define");
lp = lp.rwr ();
k = k.rwr ();
lp2 = lp2.rwr ();
name = name.rwr ();
formals = formals.rwr ();
rp2 = rp2.rwr ();
body = body.rwr ().join ('');
rp = rp.rwr ();

_ruleExit ("Sexpr_define");
return `function ${name} (${formals}) {
${body}
}
`;
},
Sexpr_eqv: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("Sexpr_eqv");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_eqv");
return `(${arg1} === ${arg2})`;
},
Sexpr_stringeq: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("Sexpr_stringeq");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_stringeq");
return `(${arg1} == ${arg2})`;
},
Sexpr_eq: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("Sexpr_eq");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_eq");
return `(${arg1} === ${arg2})`;
},
Sexpr_add: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("Sexpr_add");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_add");
return `(${arg1} + ${arg2})`;
},
Sexpr_and: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("Sexpr_and");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_and");
return `(${arg1} && ${arg2})`;
},
Sexpr_let: function (lp,k,lp2,binding,rp2,body,rp) {
_ruleEnter ("Sexpr_let");
lp = lp.rwr ();
k = k.rwr ();
lp2 = lp2.rwr ();
binding = binding.rwr ();
rp2 = rp2.rwr ();
body = body.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_let");
return `${binding}${body}`;
},
Sexpr_if: function (lp,k,test,thn,els,rp) {
_ruleEnter ("Sexpr_if");
lp = lp.rwr ();
k = k.rwr ();
test = test.rwr ();
thn = thn.rwr ();
els = els.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_if");
return `if (${test}) {
${thn};
} else {
${els};
}
`;
},
Sexpr_not: function (lp,k,arg1,rp) {
_ruleEnter ("Sexpr_not");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
rp = rp.rwr ();

_ruleExit ("Sexpr_not");
return `!${arg1}`;
},
Binding: function (lp,target,src,rp,recursive) {
_ruleEnter ("Binding");
lp = lp.rwr ();
target = target.rwr ();
src = src.rwr ();
rp = rp.rwr ();
recursive = recursive.rwr ().join ('');

_ruleExit ("Binding");
return `let ${target} = ${src};
${recursive}`;
},
Formals: function (f) {
_ruleEnter ("Formals");
f = f.rwr ().join ('');

_ruleExit ("Formals");
return `${f}`;
},
Formal: function (sym) {
_ruleEnter ("Formal");
sym = sym.rwr ();

_ruleExit ("Formal");
return `${sym},`;
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

