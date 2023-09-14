JSMacro {
include(`prolog/js.rwr.inc')
InvokeOperation [x] = ‛«x»’
InvokeOperation_assign [id lp sym kcomma arg rp] = ‛«id» = «arg»’
InvokeOperation_other [id lp args? rp] = ‛«id»«lp»«args»«rp»’
}
