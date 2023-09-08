include(`prolog.ohm.inc')

EmptyList <: Prolog {
  Sexpr :=
    | "'" "(" ")" -- empty
    | "(" Sexpr* ")" -- list
    | "'" Sexpr -- quoted
    | Symbol -- symbol
}
