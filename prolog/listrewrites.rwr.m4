SymRewrites {
include(`prolog.rwr.inc')

  Program [defines+ mainbody] = ‛«defines»«mainbody»’

  DefineSexpr_define [lp k lp2 name formals rp2 body rp] = ‛\nfunction «name» («formals») {«body»\n}\n’
  DefineSexpr_definevar [lp k name e rp] = ‛\nvar «name» = «e»;\n’

  OperationSexpr_eqv [lp k arg1 arg2 rp] = ‛(«arg1» === «arg2»)’
  OperationSexpr_stringeq [lp k arg1 arg2 rp] = ‛(«arg1» == «arg2»)’
  OperationSexpr_eq [lp k arg1 arg2 rp] = ‛(«arg1» === «arg2»)’
  OperationSexpr_add [lp k arg1 arg2 rp] = ‛(«arg1» + «arg2»)’
  OperationSexpr_and [lp k andarg1 arg2 rp] = ‛(«andarg1»«arg2»)’

  ControlFlowSexpr_let [lp k lp2 binding rp2 body rp] = ‛\n«binding»«body»’

  ControlFlowSexpr_if [lp k test thn els rp] = ‛\nif («test») {«thn»\n} else {«els»\n}’
  
  OperationSexpr_not [lp k arg1 rp] = ‛!«arg1»’


  Binding [lp target src rp recursive?] = ‛let «target» = «src»;«recursive»’

  ControlFlowSexpr_cond [lp k clauses rp] = ‛\n«clauses»\n’
  CondClauses [lp test body rp more?] = ‛«test»«body»«more»’
  CondTest [e]= ‛if «e» ’
  CondConsequent [b] = ‛{«b»\n}’
  RemainingCondClauses_else [lp els body rp] = ‛ else«body»’
  RemainingCondClauses_more [clause] = ‛ else «clause»’
  
  AndSexpr [sexpr] = ‛«sexpr» && ’

  Body [sexpr recursive?] = ‛«sexpr»«recursive»’
  StatementOperationSexpr [x] = ‛\n«x»;’

  Formals [f*] = ‛«f»’
  Formal [sym] = ‛ «sym»,’
  
  OperationSexpr_operator [lp operator operand* rp] = ‛«operator» («operand»)’
  Operand [x] = ‛ «x»,’
  
  ControlFlowAtom [a] = ‛\n«a»;’
  
  sym [s vcomma?] = ‛«s»«vcomma»’
}
