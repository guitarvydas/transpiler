include(`prolog/prolog.ohm.inc')

ExprStatements <: Prolog {

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

  OperationSexpr = "(" Operator Operand* ")"
    
  StatementOperationSexpr = OperationSexpr

  Binding = "(" Symbol Sexpr ")" Binding?
  Test = Sexpr
  Then = StatementSexpr
  Else = StatementSexpr

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
