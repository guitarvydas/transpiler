SymRewrites {
include(`prolog.rwr.inc')

  Sexpr_define [lp k lp2 name formals rp2 body+ rp] = ‛function «name» («formals») {\n«body»\n}\n’
  Sexpr_eqv [lp k arg1 arg2 rp] = ‛(«arg1» === «arg2»)’
  Sexpr_stringeq [lp k arg1 arg2 rp] = ‛(«arg1» == «arg2»)’
  Sexpr_eq [lp k arg1 arg2 rp] = ‛(«arg1» === «arg2»)’
  Sexpr_add [lp k arg1 arg2 rp] = ‛(«arg1» + «arg2»)’
  Sexpr_and [lp k arg1 arg2 rp] = ‛(«arg1» && «arg2»)’

  Sexpr_let [lp k lp2 binding rp2 body rp] = ‛«binding»«body»’

  Sexpr_if [lp k test thn els rp] = ‛if («test») {\n«thn»;\n} else {\n«els»;\n}\n’
  
  Sexpr_not [lp k arg1 rp] = ‛!«arg1»’

  Binding [lp target src rp recursive?] = ‛let «target» = «src»;\n«recursive»’
 
  Formals [f*] = ‛«f»’
  Formal [sym] = ‛«sym»,’
  
  sym [s vcomma?] = ‛«s»«vcomma»’
}
