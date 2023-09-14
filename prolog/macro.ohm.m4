include(`prolog/js.ohm.inc')

JSMacro <: JS {
  InvokeOperation := 
    | sym<"mutate"> "(" Symbol AComma Arg ")" -- assign
    | ID "(" Args? ")" -- other

}
