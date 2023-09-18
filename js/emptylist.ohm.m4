include(`prolog.ohm.inc')

EmptyList <: Prolog {
  Sexpr +=
    "'" "(" ")" -- empty
}
