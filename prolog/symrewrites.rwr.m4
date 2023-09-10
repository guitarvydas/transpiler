SymRewrites {
include(`prolog.rwr.inc')

  Symbol [x] = ‛«x»’
  Symbol_true [k] = ‛trueₓ’
  Symbol_false [k] = ‛falseₓ’
  Symbol_isPair [k] = ‛isPairₓ’
  Symbol_rBang [k] = ‛rBangₓ’
  Symbol_isForeign [k] = ‛isForeignₓ’
  Symbol_isVar [k] = ‛isVarₓ’
  Symbol_isEmptyList [k] = ‛isEmptyListₓ’
  Symbol_mutate [k] = ‛mutateₓ’
  Symbol_eStar [k] = ‛eStarₓ’
  Symbol_other [c+ vcomma?] = ‛«c»«vcomma»’

  sym [s vcomma?] = ‛«s»«vcomma»’
}
