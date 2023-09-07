var grammarText = String.raw`
Scm {
  Program = Form+
  Form = SList | Atom
  QuotedSexp = "'" Form
  BackQuotedSexp = "\x60" Form
  CommaSexp = "," Form
  SList = DottedList | NullTerminatedList
  DottedList = "(" ListItem+ DOT ListItem ")"
  NullTerminatedList =   "(" ListItem* ")"
  ListItem = (Atom | SList)
  Atom = atom | QuotedSexp | BackQuotedSexp | CommaSexp

  atom = integer | symbol | string | boolean
  boolean = "#f" | "#t"
  integer = digit+
  string = "\"" (~"\"" any)+ "\""
  symbol = letchar (letchar | digit)*
  letchar = letter | "+" | "*" | "!" | "?"  | "_" | "-" | "="
  DOT = space* "." space*
  semiColonComment = ";" (~"\n" any)* "\n"
  space += semiColonComment
}

`;
