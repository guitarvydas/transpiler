JSRetVal {
include(`js.rwr.inc')

Function [kfunction id lp formals? rp lb statements rb] ‛«_.clearret ()»’= 
‛«kfunction» «id» «lp»«formals»«rp» «lb»
let «_.rettop ()» = undefined;«statements»
return «_.rettop ()»;
«rb»
’

LetStatement [klet id keq op ksemi] ‛«_.clearret ()»’= ‛\n«klet» «id» «keq» «op»«ksemi»’

IfStatement [kif lp op rp lb s rb elsif* els?] ‛«_.retnew ()»’ =
‛
«_.rettop ()» = undefined;
«kif» «lp»«op»«rp»«lb»«s»
«rb»«elsif»«els»
«_.retprev ()» = «_.retpop ()»;’

OperationStatement [op ksemi] = ‛
«_.rettop ()» = «op»«ksemi»’

}
