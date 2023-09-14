JSMacro {
include(`prolog/js.rwr.inc')
InvokeOperation [x] = ‛«x»’
InvokeOperation_assign [kmutate lp id kcomma arg rp] = ‛«id» = «arg»’
InvokeOperation_other [id lp args? rp] = ‛«id»«lp»«args»«rp»’
}
