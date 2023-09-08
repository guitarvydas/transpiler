EmptyList {
include(`prolog.rwr.inc')
  ELSexpr_empty [q lp rp] = ‛(emptylist)’
  ELSexpr_sexpr [sexpr] = ‛«sexpr»’
}
