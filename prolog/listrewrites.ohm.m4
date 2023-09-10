include(`prolog.ohm.inc')

ListRewrites <: Prolog {
  Sexpr += ControlFlowSexpr | OperationSexpr
  StatementSexpr = ControlFlowSexpr | StatementOperationSexpr | ControlFlowAtom

  ControlFlowSexpr = 
    | "(" sym<"cond"> CondClauses ")" -- cond
    | "(" sym<"define"> "(" Symbol Formals ")" Body ")" -- define
    | "(" sym<"define"> Symbol Sexpr ")" -- definevar
    | "(" sym<"let"> "(" Binding ")" Body ")"-- let
    | "(" sym<"if"> Test Then Else ")"-- if

  OperationSexpr =
    | "(" sym<"eqv?"> Sexpr Sexpr ")" -- eqv
    | "(" sym<"string=?"> Sexpr Sexpr ")" -- stringeq
    | "(" sym<"eq?"> Sexpr Sexpr ")" -- eq
    | "(" sym<"+"> Sexpr Sexpr ")" -- add
    | "(" sym<"and"> Sexpr Sexpr ")" -- and
    | "(" sym<"not"> Sexpr ")" -- not

    | "(" Operator Operand* ")" -- operator
  StatementOperationSexpr = OperationSexpr

  Binding = "(" Symbol Sexpr ")" Binding?
  Test = Sexpr
  Then = StatementSexpr
  Else = StatementSexpr

  Body = StatementSexpr Body?
  
  CondClauses = "(" CondTest CondConsequent ")" RemainingCondClauses?
  CondTest = Sexpr
  CondConsequent = Body
  RemainingCondClauses =
    | "(" sym<"else"> CondConsequent ")" -- else
    | CondClauses -- more

  Formals = Formal*
  Formal = Symbol

  Operator = Sexpr
  Operand = Sexpr
  
  ControlFlowAtom =     
    | string -- string
    | number -- number
    | Symbol -- symbol

  sym<s> = s vcomma?
}
