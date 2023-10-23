`prolog/prolog.ohm.inc`

```
Prolog {
  Program = Sexpr+
  Sexpr =
    | "(" Sexpr* ")" -- list
    | "'" Sexpr -- quoted
    | string -- string
    | number -- number
    | Symbol -- symbol

  separator = "(" | ")" | "'" | "," | "@" | "\x60" | ";" | " . "
  vcomma = "ₓ"
  Symbol = symchar+ vcomma?
  symchar = ~vcomma ~separator ~space any
  
  string = dq (~dq any)* dq
  dq = "\""
  number = digit+ vcomma?
  semiColonComment = ";" (~"\n" any)* "\n"
  space += semiColonComment
}
```

I use *m4* to include superclasses into the various `.ohm` and `.rwr` files used in this project.
