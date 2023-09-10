include(`prolog.ohm.inc')

SymRewrites <: Prolog {
  Symbol :=
    | sym<"#t"> -- true
    | sym<"#f"> -- false
    | sym<"pair?"> -- isPair
    | sym<"r!"> -- rBang
    | sym<"foreign?"> -- isForeign
    | sym<"var?"> -- isVar
    | sym<"null?"> -- isEmptyList
    | sym<"set!"> -- mutate
    | sym<"e*"> -- eStar
    | symchar+ vcomma? -- other

  sym<s> = s vcomma?
}
