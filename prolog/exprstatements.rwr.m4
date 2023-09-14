ExprStatements {
include(`prolog/prolog.rwr.inc')

  Program [defines+ mainbody] = ‛«defines»«mainbody»’
  Sexpr [s] = ‛«s»’
  StatementSexpr [s] = ‛«s»’

  DefineSexpr_define [lp k lp2 name formals rp2 body rp] ‛«_.clearstatementvalue ()»’ = ‛
(defineₓ («name» «formals») (letₓ ((«_.statementvaluetop ()» 0ₓ))«body»
(returnₓ «_.statementvaluetop ()»)))
’
  DefineSexpr_definevar [lp k name e rp] ‛«_.clearstatementvalue ()»’ =
  ‛(defineₓ «name» «e»)(mutateₓ «_.statementvaluetop ()» «name»)’


  ControlFlowSexpr_cond [lp k clauses rp] = ‛(condₓ «clauses»)’
  ControlFlowSexpr_let [lp k lp2 binding rp2 body rp] = ‛(letₓ («binding») «body»)’
  ControlFlowSexpr_if [lp k test thn els rp] = ‛(ifₓ «test») «thn» «els»’

  

  OperationSexpr [lp operator operand* rp] = ‛(«operator» «operand»)’

  StatementOperationSexpr [s] = ‛«s»’
  
  Binding [lp target src rp recursive?] = ‛(«target» «src»)«recursive»’
  Test [s] = ‛«s»’
  Then [s] = ‛«s»’
  Else [s] = ‛«s»’

  Body [sexpr recursive?] = ‛«sexpr»«recursive»’
  MainBody [b] = ‛«b»’

  CondClauses [lp test body rp more?] = ‛(«test» «body»)«more»’
  CondTest [e]= ‛«e»’
  CondConsequent [b] = ‛«b»’
  RemainingCondClauses_else [lp kels body rp] = ‛(elseₓ «body»)’
  RemainingCondClauses_more [clause] = ‛«clause»’
  
  Formals [f*] = ‛«f»’
  Formal [sym] = ‛«sym»’
  
  Operator [s] = ‛«s»’
  Operand [s] = ‛«s»’
  
  LHS [sym] = ‛«sym»’
  RHS [e] = ‛«e»’

  ControlFlowAtom_string [a] = ‛«a»’
  ControlFlowAtom_number [a] = ‛«a»’
  ControlFlowAtom_symbol [a] = ‛«a»’
  
  sym [s vcomma?] = ‛«s»«vcomma»’


}
