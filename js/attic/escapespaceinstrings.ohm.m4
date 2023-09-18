include(`prolog	.ohm.inc')

EscapeSpaceInStrings <: JS {
  string := dq (~dq strchar)* dq
  strchar =
    | " " -- space
    | "\n" -- nl
    | "\t" -- tab
    | any -- any
}
