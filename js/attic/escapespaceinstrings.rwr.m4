EscapeSpaceInStrings{
include(`prolog.rwr.inc')

  string [ldq strchar* rdq] = ‛«ldq»«strchar»«rdq»’
  strchar_space [c] = ‛«◦»’
  strchar_nl [c] = ‛«▿»’
  strchar_tab [c] = ‛«▹»’
  strchar_any [c] = ‛«c»’
}
