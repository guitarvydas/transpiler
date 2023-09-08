Prolog {
  Sexprs = Sexpr+
  Sexpr =
    | "(" Sexpr+ ")" -- list
    | "'" Sexpr -- quoted
    | Symbol -- symbol

  separator = "(" | ")" | "'" | "," | "@" | "`" | ";" | " . "
  vcomma = "₊"
  Symbol = symchar+ vcomma?
  symchar = ~vcomma ~separator any
  
  semiColonComment = ";" (~"\n" any)* "\n"
  space += semiColonComment
}
