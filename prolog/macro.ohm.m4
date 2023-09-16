JSMacro {
  stuff = item+
  item =
    | applySyntactic<Macro>
    | any

  Macro =
    | "mutate" vcomma "(" Sym argComma Expr argComma ")" -- assign

  Sym = char+
  Expr = innerItem+
  innerItem =
    | applySyntactic<Macro> -- macro
    | "(" innerItemArgComma* ")" -- nested
    | char -- other 

  innerItemArgComma = innerItem+ argComma
  char = ~delimiter any
  delimiter = argComma | "(" | ")"
  argComma = "†"
  vcomma = "ₓ"
}
