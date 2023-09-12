JS {
  Program = (Function | Variable | Assignment)+ Main
  Function = "function" ID "(" Formals? ")" "{" Statements "}"
  Variable = "var" ID "=" Operation ";"
  Assignment = ID "=" Operation ";"
  Main = Statements

  Formals =
    | ID "," Formals -- nonlastformal
    | ID ","? -- lastformal

  Statements =
    | IfStatement Statements? -- if
    | LetStatement Statements? -- let
    | OperationStatement Statements? -- op

  IfStatement = "if" "(" Operation ")" "{" Statements "}" Elsif* Els?
  LetStatement = "let" ID "=" Operation ";"
  OperationStatement = Operation ";"

  Elsif = "else" "if" "(" Operation ")" "{" Statements "}" Elsif*
  Els = "else" "{" Statements "}"

  Operation =
    | Operation InfixOperator Operation -- infix
    | UnaryOperator Operation -- unary
    | "(" Operation ")" -- parenthesized
    | InvokeOperation -- invoke
    | Atom -- atom

  InvokeOperation =  ID "(" Args? ")"

  Arg =
    | Operation -- op
    | Atom -- atom
    
  Args = 
    | Arg "," Args -- list
    | Arg ","? -- final

  Atom =
    | String -- string
    | Number -- number
    | Symbol -- symbol

  String = dq (~dq any)* dq
  dq = "\""
  Number = Integer
  Integer = digit+
  Symbol = ID

  InfixOperator =
    | "===" -- eqv
    | "==" -- eq
    | "&&" -- branchingand
    | "||" -- branchingor
    | "+" -- plus

  UnaryOperator =
    | "!"
    
  ID = legalCharacterFirst legalCharacterRest*
  legalCharacterFirst = letter | "_"
  legalCharacterRest = legalCharacterFirst | digit
}
