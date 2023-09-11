{
Program: function (Sexpr) {
_ruleEnter ("Program");
Sexpr = Sexpr.rwr ().join ('');

_ruleExit ("Program");
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
Program: function (defines,mainbody) {
_ruleEnter ("Program");
defines = defines.rwr ().join ('');
mainbody = mainbody.rwr ();

_ruleExit ("Program");
return `${defines}${mainbody}`;
},
DefineSexpr_define: function (lp,k,lp2,name,formals,rp2,body,rp) {
_ruleEnter ("DefineSexpr_define");
lp = lp.rwr ();
k = k.rwr ();
lp2 = lp2.rwr ();
name = name.rwr ();
formals = formals.rwr ();
rp2 = rp2.rwr ();
body = body.rwr ();
rp = rp.rwr ();

_ruleExit ("DefineSexpr_define");
return `
function ${name} (${formals}) {${body}
}
`;
},
DefineSexpr_definevar: function (lp,k,name,e,rp) {
_ruleEnter ("DefineSexpr_definevar");
lp = lp.rwr ();
k = k.rwr ();
name = name.rwr ();
e = e.rwr ();
rp = rp.rwr ();

_ruleExit ("DefineSexpr_definevar");
return `
var ${name} = ${e};
`;
},
OperationSexpr_eqv: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("OperationSexpr_eqv");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("OperationSexpr_eqv");
return `${arg1} === ${arg2}`;
},
OperationSexpr_stringeq: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("OperationSexpr_stringeq");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("OperationSexpr_stringeq");
return `${arg1} == ${arg2}`;
},
OperationSexpr_eq: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("OperationSexpr_eq");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("OperationSexpr_eq");
return `${arg1} === ${arg2}`;
},
OperationSexpr_add: function (lp,k,arg1,arg2,rp) {
_ruleEnter ("OperationSexpr_add");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
arg2 = arg2.rwr ();
rp = rp.rwr ();

_ruleExit ("OperationSexpr_add");
return `${arg1} + ${arg2}`;
},
OperationSexpr_and: function (lp,k,andarg,rp) {
_ruleEnter ("OperationSexpr_and");
lp = lp.rwr ();
k = k.rwr ();
andarg = andarg.rwr ();
rp = rp.rwr ();

_ruleExit ("OperationSexpr_and");
return `${andarg}`;
},
ControlFlowSexpr_let: function (lp,k,lp2,binding,rp2,body,rp) {
_ruleEnter ("ControlFlowSexpr_let");
lp = lp.rwr ();
k = k.rwr ();
lp2 = lp2.rwr ();
binding = binding.rwr ();
rp2 = rp2.rwr ();
body = body.rwr ();
rp = rp.rwr ();

_ruleExit ("ControlFlowSexpr_let");
return `
${binding}${body}`;
},
ControlFlowSexpr_if: function (lp,k,test,thn,els,rp) {
_ruleEnter ("ControlFlowSexpr_if");
lp = lp.rwr ();
k = k.rwr ();
test = test.rwr ();
thn = thn.rwr ();
els = els.rwr ();
rp = rp.rwr ();

_ruleExit ("ControlFlowSexpr_if");
return `
if (${test}) {${thn}
} else {${els}
}`;
},
OperationSexpr_not: function (lp,k,arg1,rp) {
_ruleEnter ("OperationSexpr_not");
lp = lp.rwr ();
k = k.rwr ();
arg1 = arg1.rwr ();
rp = rp.rwr ();

_ruleExit ("OperationSexpr_not");
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
return `let ${target} = ${src};${recursive}`;
},
ControlFlowSexpr_cond: function (lp,k,clauses,rp) {
_ruleEnter ("ControlFlowSexpr_cond");
lp = lp.rwr ();
k = k.rwr ();
clauses = clauses.rwr ();
rp = rp.rwr ();

_ruleExit ("ControlFlowSexpr_cond");
return `
${clauses}
`;
},
CondClauses: function (lp,test,body,rp,more) {
_ruleEnter ("CondClauses");
lp = lp.rwr ();
test = test.rwr ();
body = body.rwr ();
rp = rp.rwr ();
more = more.rwr ().join ('');

_ruleExit ("CondClauses");
return `${test}${body}${more}`;
},
CondTest: function (e) {
_ruleEnter ("CondTest");
e = e.rwr ();

_ruleExit ("CondTest");
return `if (${e}) `;
},
CondConsequent: function (b) {
_ruleEnter ("CondConsequent");
b = b.rwr ();

_ruleExit ("CondConsequent");
return `{${b}
}`;
},
RemainingCondClauses_else: function (lp,els,body,rp) {
_ruleEnter ("RemainingCondClauses_else");
lp = lp.rwr ();
els = els.rwr ();
body = body.rwr ();
rp = rp.rwr ();

_ruleExit ("RemainingCondClauses_else");
return ` else${body}`;
},
RemainingCondClauses_more: function (clause) {
_ruleEnter ("RemainingCondClauses_more");
clause = clause.rwr ();

_ruleExit ("RemainingCondClauses_more");
return ` else ${clause}`;
},
AndSexpr_rec: function (sexpr,rec) {
_ruleEnter ("AndSexpr_rec");
sexpr = sexpr.rwr ();
rec = rec.rwr ();

_ruleExit ("AndSexpr_rec");
return `(${sexpr}) && ${rec}`;
},
AndSexpr_bottom: function (sexpr) {
_ruleEnter ("AndSexpr_bottom");
sexpr = sexpr.rwr ();

_ruleExit ("AndSexpr_bottom");
return `(${sexpr})`;
},
Body: function (sexpr,recursive) {
_ruleEnter ("Body");
sexpr = sexpr.rwr ();
recursive = recursive.rwr ().join ('');

_ruleExit ("Body");
return `${sexpr}${recursive}`;
},
StatementOperationSexpr: function (x) {
_ruleEnter ("StatementOperationSexpr");
x = x.rwr ();

_ruleExit ("StatementOperationSexpr");
return `
${x};`;
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
return ` ${sym},`;
},
OperationSexpr_operator: function (lp,operator,operand,rp) {
_ruleEnter ("OperationSexpr_operator");
lp = lp.rwr ();
operator = operator.rwr ();
operand = operand.rwr ().join ('');
rp = rp.rwr ();

_ruleExit ("OperationSexpr_operator");
return `${operator} (${operand})`;
},
Operand: function (x) {
_ruleEnter ("Operand");
x = x.rwr ();

_ruleExit ("Operand");
return ` ${x},`;
},
ControlFlowAtom: function (a) {
_ruleEnter ("ControlFlowAtom");
a = a.rwr ();

_ruleExit ("ControlFlowAtom");
return `
${a};`;
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

