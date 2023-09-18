{
Program: function (fv,main) {
_ruleEnter ("Program");
fv = fv.rwr ().join ('');
main = main.rwr ();

_ruleExit ("Program");
return `${fv}${main}`;
},
Function: function (kfunction,id,lp,formals,rp,lb,statements,rb) {
_ruleEnter ("Function");
kfunction = kfunction.rwr ();
id = id.rwr ();
lp = lp.rwr ();
formals = formals.rwr ().join ('');
rp = rp.rwr ();
lb = lb.rwr ();
statements = statements.rwr ();
rb = rb.rwr ();

_ruleExit ("Function");
return `
${kfunction} ${id} ${lp}${formals}${rp} ${lb}${statements}
${rb}
`;
},
Variable: function (kvar,id,keq,operations,ksemi) {
_ruleEnter ("Variable");
kvar = kvar.rwr ();
id = id.rwr ();
keq = keq.rwr ();
operations = operations.rwr ();
ksemi = ksemi.rwr ();

_ruleExit ("Variable");
return `
${kvar} ${id} ${keq} ${operations}${ksemi}`;
},
Assignment: function (id,keq,operation,ksemi) {
_ruleEnter ("Assignment");
id = id.rwr ();
keq = keq.rwr ();
operation = operation.rwr ();
ksemi = ksemi.rwr ();

_ruleExit ("Assignment");
return `
${id} ${keq} ${operation}${ksemi}`;
},
Main: function (s) {
_ruleEnter ("Main");
s = s.rwr ();

_ruleExit ("Main");
return `${s}`;
},
Formals_nonlastformal: function (id,kcomma,more) {
_ruleEnter ("Formals_nonlastformal");
id = id.rwr ();
kcomma = kcomma.rwr ();
more = more.rwr ();

_ruleExit ("Formals_nonlastformal");
return `${id}${kcomma} ${more}`;
},
Formals_lastformal: function (id,kcomma) {
_ruleEnter ("Formals_lastformal");
id = id.rwr ();
kcomma = kcomma.rwr ();

_ruleExit ("Formals_lastformal");
return `${id}`;
},
Statements_if: function (s,more) {
_ruleEnter ("Statements_if");
s = s.rwr ();
more = more.rwr ().join ('');

_ruleExit ("Statements_if");
return `${s}${more}`;
},
Statements_let: function (s,more) {
_ruleEnter ("Statements_let");
s = s.rwr ();
more = more.rwr ().join ('');

_ruleExit ("Statements_let");
return `${s}${more}`;
},
Statements_op: function (s,more) {
_ruleEnter ("Statements_op");
s = s.rwr ();
more = more.rwr ().join ('');

_ruleExit ("Statements_op");
return `${s}${more}`;
},
OperationStatement: function (op,ksemi) {
_ruleEnter ("OperationStatement");
op = op.rwr ();
ksemi = ksemi.rwr ();

_ruleExit ("OperationStatement");
return `
${op}${ksemi}`;
},
LetStatement: function (klet,id,keq,op,ksemi) {
_ruleEnter ("LetStatement");
klet = klet.rwr ();
id = id.rwr ();
keq = keq.rwr ();
op = op.rwr ();
ksemi = ksemi.rwr ();

_ruleExit ("LetStatement");
return `
${klet} ${id} ${keq} ${op}${ksemi}`;
},
IfStatement: function (kif,lp,op,rp,lb,s,rb,elsif,els) {
_ruleEnter ("IfStatement");
kif = kif.rwr ();
lp = lp.rwr ();
op = op.rwr ();
rp = rp.rwr ();
lb = lb.rwr ();
s = s.rwr ();
rb = rb.rwr ();
elsif = elsif.rwr ().join ('');
els = els.rwr ().join ('');

_ruleExit ("IfStatement");
return `
${kif} ${lp}${op}${rp}${lb}${s}
${rb}${elsif}${els}`;
},
Elsif: function (kelse,kif,lp,op,rp,lb,s,rb,elsif) {
_ruleEnter ("Elsif");
kelse = kelse.rwr ();
kif = kif.rwr ();
lp = lp.rwr ();
op = op.rwr ();
rp = rp.rwr ();
lb = lb.rwr ();
s = s.rwr ();
rb = rb.rwr ();
elsif = elsif.rwr ().join ('');

_ruleExit ("Elsif");
return ` ${kelse} ${kif} ${lp}${op}${rp}${lb}${s}
${rb}${elsif}`;
},
Els: function (kelse,lb,s,rb) {
_ruleEnter ("Els");
kelse = kelse.rwr ();
lb = lb.rwr ();
s = s.rwr ();
rb = rb.rwr ();

_ruleExit ("Els");
return ` ${kelse} ${lb}${s}
${rb}`;
},
Operation_infix: function (op1,infixop,op2) {
_ruleEnter ("Operation_infix");
op1 = op1.rwr ();
infixop = infixop.rwr ();
op2 = op2.rwr ();

_ruleExit ("Operation_infix");
return `${op1} ${infixop} ${op2}`;
},
Operation_unary: function (uop,op) {
_ruleEnter ("Operation_unary");
uop = uop.rwr ();
op = op.rwr ();

_ruleExit ("Operation_unary");
return `${uop}${op}`;
},
Operation_parenthesized: function (lp,op,rp) {
_ruleEnter ("Operation_parenthesized");
lp = lp.rwr ();
op = op.rwr ();
rp = rp.rwr ();

_ruleExit ("Operation_parenthesized");
return `${lp}${op}${rp}`;
},
Operation_invoke: function (x) {
_ruleEnter ("Operation_invoke");
x = x.rwr ();

_ruleExit ("Operation_invoke");
return `${x}`;
},
Operation_atom: function (a) {
_ruleEnter ("Operation_atom");
a = a.rwr ();

_ruleExit ("Operation_atom");
return `${a}`;
},
InvokeOperation: function (id,lp,args,rp) {
_ruleEnter ("InvokeOperation");
id = id.rwr ();
lp = lp.rwr ();
args = args.rwr ().join ('');
rp = rp.rwr ();

_ruleExit ("InvokeOperation");
return `${id}${lp}${args}${rp}`;
},
Args: function (a) {
_ruleEnter ("Args");
a = a.rwr ().join ('');

_ruleExit ("Args");
return `${a}`;
},
Arg_op: function (op,acomma) {
_ruleEnter ("Arg_op");
op = op.rwr ();
acomma = acomma.rwr ();

_ruleExit ("Arg_op");
return `${op}${acomma}`;
},
Arg_atom: function (a,acomma) {
_ruleEnter ("Arg_atom");
a = a.rwr ();
acomma = acomma.rwr ();

_ruleExit ("Arg_atom");
return `${a}${acomma}`;
},
Atom_string: function (x) {
_ruleEnter ("Atom_string");
x = x.rwr ();

_ruleExit ("Atom_string");
return `${x}`;
},
Atom_number: function (x) {
_ruleEnter ("Atom_number");
x = x.rwr ();

_ruleExit ("Atom_number");
return `${x}`;
},
Atom_symbol: function (x) {
_ruleEnter ("Atom_symbol");
x = x.rwr ();

_ruleExit ("Atom_symbol");
return `${x}`;
},
String: function (ldq,c,rdq) {
_ruleEnter ("String");
ldq = ldq.rwr ();
c = c.rwr ().join ('');
rdq = rdq.rwr ();

_ruleExit ("String");
return `${ldq}${c}${rdq}`;
},
dq: function (c) {
_ruleEnter ("dq");
c = c.rwr ();

_ruleExit ("dq");
return `${c}`;
},
Number: function (n) {
_ruleEnter ("Number");
n = n.rwr ();

_ruleExit ("Number");
return `${n}`;
},
Integer: function (d) {
_ruleEnter ("Integer");
d = d.rwr ().join ('');

_ruleExit ("Integer");
return `${d}`;
},
Symbol: function (id) {
_ruleEnter ("Symbol");
id = id.rwr ();

_ruleExit ("Symbol");
return `${id}`;
},
InfixOperator_eqv: function (x) {
_ruleEnter ("InfixOperator_eqv");
x = x.rwr ();

_ruleExit ("InfixOperator_eqv");
return `${x}`;
},
InfixOperator_eq: function (x) {
_ruleEnter ("InfixOperator_eq");
x = x.rwr ();

_ruleExit ("InfixOperator_eq");
return `${x}`;
},
InfixOperator_branchingand: function (x) {
_ruleEnter ("InfixOperator_branchingand");
x = x.rwr ();

_ruleExit ("InfixOperator_branchingand");
return `${x}`;
},
InfixOperator_branchingor: function (x) {
_ruleEnter ("InfixOperator_branchingor");
x = x.rwr ();

_ruleExit ("InfixOperator_branchingor");
return `${x}`;
},
InfixOperator_plus: function (x) {
_ruleEnter ("InfixOperator_plus");
x = x.rwr ();

_ruleExit ("InfixOperator_plus");
return `${x}`;
},
UnaryOperator: function (opr) {
_ruleEnter ("UnaryOperator");
opr = opr.rwr ();

_ruleExit ("UnaryOperator");
return `${opr}`;
},
ID: function (c,cs) {
_ruleEnter ("ID");
c = c.rwr ();
cs = cs.rwr ().join ('');

_ruleExit ("ID");
return `${c}${cs}`;
},
legalCharacterFirst: function (c) {
_ruleEnter ("legalCharacterFirst");
c = c.rwr ();

_ruleExit ("legalCharacterFirst");
return `${c}`;
},
legalCharacterRest: function (c) {
_ruleEnter ("legalCharacterRest");
c = c.rwr ();

_ruleExit ("legalCharacterRest");
return `${c}`;
},
sym: function (s,vcomma) {
_ruleEnter ("sym");
s = s.rwr ();
vcomma = vcomma.rwr ().join ('');

_ruleExit ("sym");
return `${s}${vcomma}`;
},
InvokeOperation: function (x) {
_ruleEnter ("InvokeOperation");
x = x.rwr ();

_ruleExit ("InvokeOperation");
return `${x}`;
},
InvokeOperation_assign: function (id,lp,sym,kcomma,arg,rp) {
_ruleEnter ("InvokeOperation_assign");
id = id.rwr ();
lp = lp.rwr ();
sym = sym.rwr ();
kcomma = kcomma.rwr ();
arg = arg.rwr ();
rp = rp.rwr ();

_ruleExit ("InvokeOperation_assign");
return `${id} = ${arg}`;
},
InvokeOperation_other: function (id,lp,args,rp) {
_ruleEnter ("InvokeOperation_other");
id = id.rwr ();
lp = lp.rwr ();
args = args.rwr ().join ('');
rp = rp.rwr ();

_ruleExit ("InvokeOperation_other");
return `${id}${lp}${args}${rp}`;
},

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

