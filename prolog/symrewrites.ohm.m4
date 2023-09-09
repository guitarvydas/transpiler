include(`prolog.ohm.inc')

SymRewrites <: Prolog {
  Symbol :=
    | sym<"#t"> vcomma? -- true
    | sym<"#f"> vcomma? -- false
    | sym<"pair?"> vcomma? -- isPair
    | sym<"r!"> vcomma? -- rBang
    | sym<"foreign?"> vcomma? -- isForeign
    | sym<"var?"> vcomma? -- isVar
    | sym<"null?"> vcomma? -- isEmptyList
    | sym<"e*"> vcomma? -- eStar
    | symchar+ vcomma? -- other

  sym<s> = s vcomma?
}
