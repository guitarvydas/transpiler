include(`prolog.ohm.inc')

ListRewrites <: Prolog {
  Sexpr +=
    | "(" sym<"define"> "(" Symbol Formals ")" Sexpr+ ")" -- define
    | "(" sym<"let"> "(" Binding ")"   Sexpr ")"-- let
    | "(" sym<"if"> Test Then Else ")"-- if
    | "(" sym<"eqv?"> Sexpr Sexpr ")" -- eqv
    | "(" sym<"string=?"> Sexpr Sexpr ")" -- stringeq
    | "(" sym<"eq?"> Sexpr Sexpr ")" -- eq
    | "(" sym<"+"> Sexpr Sexpr ")" -- add
    | "(" sym<"and"> Sexpr Sexpr ")" -- and
    | "(" sym<"not"> Sexpr ")" -- not

  Binding = "(" Symbol Sexpr ")" Binding?
  Test = Sexpr
  Then = Sexpr
  Else = Sexpr

  Formals = Formal*
  Formal = Symbol
  
  sym<s> = s vcomma?
}
