JSMacro {
  stuff [item+] = ‛«item»’
  Macro_assign [kmutate kvcomma lp sym kacomma1 a2 kacomma2 rp] = ‛\n«sym» = «a2»’

  Sym [c+] = ‛«c»’
  Expr [inneritem+] = ‛«inneritem»’
  inneritem_macro [m] = ‛«m»’
  inneritem_nested [lp c* rp] = ‛«lp»«c»«rp»’
  inneritem_other [c] = ‛«c»’
}
