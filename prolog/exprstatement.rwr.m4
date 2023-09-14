ExprStatement {
include(`js.rwr.inc')

Function [kfunction id lp formals? rp lb statements rb] ‛«_.clearret ()»’= 
‛\n«kfunction» «id» «lp»«formals»«rp» «lb»
let «_.rettop ()» = undefined;«statements»
return «_.rettop ()»;
«rb»
’

LetStatement [klet id keq op ksemi] = ‛
«klet» «id» «keq» «op»«ksemi»
«_.rettop ()» = «id»;’


IfStatement [kif lp op rp lb s rb elsif* els?] ‛«_.retnew ()»’ =
‛
let «_.rettop ()» = undefined;
«kif» «lp»«op»«rp»«lb»«s»
«rb»«elsif»«els»
«_.retprev ()» = «_.retpop ()»;’

OperationStatement [op ksemi] = ‛
«_.rettop ()» = «op»«ksemi»’

Main [s] ‛«_.clearret ()»’ = ‛\nlet «_.rettop ()» = undefined;«s»’
}
