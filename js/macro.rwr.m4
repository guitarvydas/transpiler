JSMacro {
  stuff [items+] = ‛«items»’
  Macro_assign [kmutate kvcomma lp sym kacomma1 a2 kacomma2 rp] = ‛«sym» = «a2»’

  Sym [cs+] = ‛«cs»’
  Expr [innerItems+] = ‛«innerItems»’
  innerItem_macro [m] = ‛«m»’
  innerItem_actual [lp innerItemArgCommas* rp] = ‛«lp»«innerItemArgCommas»«rp»’
  innerItem_nested [lp innerItem* rp] = ‛«lp»«innerItem»«rp»’
  innerItem_other [c] = ‛«c»’
  innerItemArgComma [innerItems+ argComma] = ‛«innerItems»«argComma»’
}
