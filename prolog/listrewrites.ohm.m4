include(`prolog/prolog.ohm.inc')

ListRewrites <: Prolog {

  Program := DefineSexpr+ MainBody

  Sexpr += DefineSexpr | ControlFlowSexpr | OperationSexpr
  StatementSexpr = DefineSexpr | ControlFlowSexpr | StatementOperationSexpr | ControlFlowAtom

  DefineSexpr = 
    | "(" sym<"define"> "(" Symbol Formals ")" Body ")" -- define
    | "(" sym<"define"> Symbol Sexpr ")" -- definevar

  ControlFlowSexpr = 
    | "(" sym<"cond"> CondClauses ")" -- cond
    | "(" sym<"let"> "(" Binding ")" Body ")"-- let
    | "(" sym<"if"> Test Then Else ")"-- if

  OperationSexpr =
    | "(" sym<"eqv?"> Sexpr Sexpr ")" -- eqv
    | "(" sym<"string=?"> Sexpr Sexpr ")" -- stringeq
    | "(" sym<"eq?"> Sexpr Sexpr ")" -- eq
    | "(" sym<"+"> Sexpr Sexpr ")" -- add
    | "(" sym<"and"> AndSexpr ")" -- and
    | "(" sym<"or"> OrSexpr ")" -- or
    | "(" sym<"not"> Sexpr ")" -- not

    | "(" Operator Operand* ")" -- operator
  StatementOperationSexpr = OperationSexpr

  Binding = "(" Symbol Sexpr ")" Binding?
  Test = Sexpr
  Then = StatementSexpr
  Else = StatementSexpr

  AndSexpr = 
    | Sexpr AndSexpr -- rec
    | Sexpr -- bottom
  
  OrSexpr = 
    | Sexpr OrSexpr -- rec
    | Sexpr -- bottom
  
  Body = StatementSexpr Body?
  MainBody = Body
  
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
  
  LHS = Symbol
  RHS = Sexpr

  ControlFlowAtom =     
    | string -- string
    | number -- number
    | Symbol -- symbol

  sym<s> = s vcomma?
}
