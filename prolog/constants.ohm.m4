include(`prolog.ohm.inc')

Constants <: Prolog {
  Sexpr += "(" sym<"quote"> CSexpr ")" -- beginconstantlist

  CSexpr = 
    | "(" CSexpr* ")" -- constantlist
    | string -- constantstring
    | integer -- constantinteger
    | Symbol -- constantsymbol

  integer = number
  sym<s> = s vcomma?
}
