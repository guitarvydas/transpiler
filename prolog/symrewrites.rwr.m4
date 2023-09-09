SymRewrites {
include(`prolog.rwr.inc')

  Symbol [x] = ‛«x»’
  Symbol_true [k vcomma?] = ‛true₊’
  Symbol_false [k vcomma?] = ‛false₊’
  Symbol_isPair [k vcomma?] = ‛isPair₊’
  Symbol_rBang [k vcomma?] = ‛rBang₊’
  Symbol_isForeign [k vcomma?] = ‛isForeign₊’
  Symbol_isVar [k vcomma?] = ‛isVar₊’
  Symbol_isEmptyList [k vcomma?] = ‛isEmptyList₊’
  Symbol_eStar [k vcomma?] = ‛eStar₊’
  Symbol_other [c+ vcomma?] = ‛«c»₊’

  sym [s vcomma?] = ‛«s»«vcomma»’
}
