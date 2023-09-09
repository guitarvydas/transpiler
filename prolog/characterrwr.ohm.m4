include(`prolog.ohm.inc')

CharacterRewrites <: Prolog {
  symchar := 
    | ~vcomma ~separator ~space "-" -- dash
    | ~vcomma ~separator ~space any -- other
}
