JSMacro {
  stuff = item+
  item =
    | applySyntactic<Macro>
    | any

  Macro =
    | "mutate" vcomma "(" Sym argComma Expr argComma ")" -- assign

  Sym = char+
  Expr = inneritem+
  inneritem =
    | applySyntactic<Macro> -- macro
    | "(" char* ")" -- nested
    | char -- other 

  char = ~delimiter any
  delimiter = argComma | "(" | ")"
  argComma = "†"
  vcomma = "ₓ"
}
