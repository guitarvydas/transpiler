    

var grammarText = String.raw`
Scm {
  Program = Form+
  Form = SList | Atom
  QuotedSexp = "'" Form
  BackQuotedSexp = "\x60" Form
  CommaSexp = "," Form
  SList = DottedList | NullTerminatedList
  DottedList = "(" ListItem+ lexical_DOT ListItem ")"
  NullTerminatedList =   "(" ListItem* ")"
  ListItem = (Atom | SList)
  Atom = lexical_atom | Syntactic_Atom
  Syntactic_Atom = QuotedSexp | BackQuotedSexp | CommaSexp

  lexical_atom = lexical_integer | lexical_symbol | lexical_string | lexical_boolean
  lexical_boolean = "#f" | "#t"
  lexical_integer = lexical_numchar+
  lexical_numchar = "0".."9"
  lexical_string = "\"" (~"\"" any)+ "\""
  lexical_symbol = lexical_letchar (lexical_letchar | lexical_numchar)*
  lexical_letchar = lexical_lc | lexical_uc | "+" | "*" | "!" | "?"  | "_" | "-" | "="
  lexical_lc = "a".."z"
  lexical_uc = "A".."Z"
  lexical_DOT = space* "." space*
  semiColonComment = ";" (~"\n" any)* "\n"
  space += semiColonComment
}
`;
