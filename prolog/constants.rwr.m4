Constants {
include(`prolog.rwr.inc')

  Sexpr_beginconstantlist [lp q sexpr rp] = ‛«sexpr»’

  CSexpr_constantlist [lp Sexprs* rp] = ‛(constant-list «Sexprs»)’
  CSexpr_constantstring [k] = ‛(constant-string "«k»")’
  CSexpr_constantinteger [k] = ‛(constant-integer "«k»")’
  CSexpr_constantsymbol [k] = ‛(constant-symbol "«k»")’

  sym [s vcomma?] = ‛«s»«vcomma»’
}
