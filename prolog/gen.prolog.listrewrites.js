function firstₓ (xₓ,) {
(carₓxₓ)
}
function restₓ (xₓ,) {
(cdrₓxₓ)
}
function append2ₓ (list1ₓ,list2ₓ,) {
if ((isEmptyListₓlist1ₓ)) {
list2ₓ;
} else {
(consₓ(carₓlist1ₓ)(append2ₓ(cdrₓlist1ₓ)list2ₓ));
}

}
function append3ₓ (list1ₓ,list2ₓ,list3ₓ,) {
(append2ₓlist1ₓ(append2ₓlist2ₓlist3ₓ))
}
(defineₓresult_ₓ(constant_nilₓ))function clear_resultₓ () {
(set!ₓresult_ₓ(constant_nilₓ))
}
function append_to_resultₓ (lisₓ,) {
(set!ₓresult_ₓ(consₓlisₓresult_ₓ))
}
function get_resultₓ () {
result_ₓ
}
function display_resultₓ () {
(displayₓ(get_resultₓ))
}
(defineₓlinkₓlistₓ)(defineₓL_lₓcarₓ)(defineₓL_gₓcadrₓ)(defineₓL_rₓcaddrₓ)(defineₓL_eₓcadddrₓ)function L_nₓ (xₓ,) {
(carₓ(cddddrₓxₓ))
}
function L_cₓ (xₓ,) {
(cadrₓ(cddddrₓxₓ))
}
function clear_rₓ (xₓ,) {
(set_car!ₓ(cddrₓxₓ)(constant_listₓ(constant_nilₓ)))
}
function back6ₓ (lₓ,gₓ,rₓ,eₓ,nₓ,cₓ,whole_dbₓ,) {
(condₓ(((isPairₓgₓ) && (isPairₓrₓ))(prove6ₓlₓgₓ(cdrₓrₓ)eₓnₓcₓwhole_dbₓ))((isPairₓlₓ)(prove6ₓ(L_lₓlₓ)(L_gₓlₓ)(cdrₓ(L_rₓlₓ))(L_eₓlₓ)(L_nₓlₓ)(L_cₓlₓ)whole_dbₓ)))
}
function prove6ₓ (lₓ,gₓ,rₓ,eₓ,nₓ,cₓ,whole_dbₓ,) {
(condₓ((isEmptyListₓgₓ)let next_resultₓ = (print_frameₓeₓ);
(append_to_resultₓnext_resultₓ)(back6ₓlₓgₓrₓeₓnₓcₓwhole_dbₓ))(((constant_symbolₓ"!ₓ") === (carₓgₓ))(clear_rₓcₓ)(prove6ₓcₓ(cdrₓgₓ)rₓeₓnₓcₓwhole_dbₓ))(((constant_symbolₓ"r!ₓ") === (carₓgₓ))(prove6ₓlₓ(cddrₓgₓ)rₓeₓnₓ(cadrₓgₓ)whole_dbₓ))((isEmptyListₓrₓ)if ((isEmptyListₓlₓ)) {
trueₓ;
} else {
(back6ₓlₓgₓrₓeₓnₓcₓwhole_dbₓ);
}
)((isForeignₓ(carₓgₓ))(call_foreignₓ(carₓgₓ)eₓ)(prove6ₓlₓ(cdrₓgₓ)rₓeₓnₓcₓwhole_dbₓ))((isForeignₓ(carₓrₓ))(call_foreignₓ(carₓrₓ)eₓ)(prove6ₓlₓgₓ(cdrₓrₓ)eₓnₓcₓwhole_dbₓ))(elseₓlet aₓ = (copyₓ(carₓrₓ)nₓ);
let eStarₓ = (unifyₓ(carₓaₓ)(carₓgₓ)eₓ);
if (eStarₓ) {
(prove6ₓ(linkₓlₓgₓrₓeₓnₓcₓ)(append3ₓ(cdrₓaₓ)(listₓ(constant_symbolₓ"r!ₓ")lₓ)(cdrₓgₓ))whole_dbₓeStarₓ(1ₓ + nₓ)lₓwhole_dbₓ);
} else {
(back6ₓlₓgₓrₓeₓnₓcₓwhole_dbₓ);
}
))
}
(defineₓemptyₓ(constant_listₓ(constant_listₓ(constant_symbolₓ"bottomₓ"))))(defineₓnameₓcadrₓ)(defineₓtimeₓcddrₓ)function isVarₓ (xₓ,) {
(andₓ(isPairₓxₓ)(string?ₓ(carₓxₓ))("?ₓ" == (carₓxₓ)))
}
function lookup_loopₓ (eₓ,idₓ,tmₓ,) {
(condₓ(!(isPairₓ(caarₓeₓ))falseₓ)(((idₓ === (nameₓ(caarₓeₓ))) && (tmₓ === (timeₓ(caarₓeₓ))))(carₓeₓ))(elseₓ(lookup_loopₓ(cdrₓeₓ)idₓtmₓ)))
}
function lookupₓ (vₓ,eₓ,) {
let idₓ = (nameₓvₓ);
let tmₓ = (timeₓvₓ);
(lookup_loopₓeₓidₓtmₓ)
}
function valueₓ (xₓ,eₓ,) {
(condₓ((isForeignₓxₓ)(call_foreignₓxₓeₓ))((isVarₓxₓ)let vₓ = (lookupₓxₓeₓ);
if (vₓ) {
(valueₓ(cadrₓvₓ)eₓ);
} else {
xₓ;
}
)(elseₓxₓ))
}
function copyₓ (xₓ,nₓ,) {
(condₓ(!(isPairₓxₓ)xₓ)((isVarₓxₓ)(append2ₓxₓnₓ))(elseₓ(consₓ(copyₓ(carₓxₓ)nₓ)(copyₓ(cdrₓxₓ)nₓ))))
}
function bindₓ (xₓ,yₓ,eₓ,) {
(consₓ(listₓxₓyₓ)eₓ)
}
function unifyₓ (x1ₓ,y1ₓ,eₓ,) {
let xₓ = (valueₓx1ₓeₓ);
let yₓ = (valueₓy1ₓeₓ);
(condₓ((xₓ === yₓ)eₓ)((isVarₓxₓ)(bindₓxₓyₓeₓ))((isVarₓyₓ)(bindₓyₓxₓeₓ))((orₓ!(isPairₓxₓ)!(isPairₓyₓ))falseₓ)(elseₓlet eStarₓ = (unifyₓ(carₓxₓ)(carₓyₓ)eₓ);
(eStarₓ && (unifyₓ(cdrₓxₓ)(cdrₓyₓ)eStarₓ))))
}
function resolveₓ (xₓ,eₓ,) {
(condₓ(!(isPairₓxₓ)xₓ)((isVarₓxₓ)let vₓ = (valueₓxₓeₓ);
if ((isVarₓvₓ)) {
vₓ;
} else {
(resolveₓvₓeₓ);
}
)(elseₓ(consₓ(resolveₓ(carₓxₓ)eₓ)(resolveₓ(cdrₓxₓ)eₓ))))
}
function has_bindings_Q_ₓ (eeₓ,) {
(isPairₓ(cdrₓeeₓ))
}
function get_var_name_from_bindingₓ (eeₓ,) {
(cadaarₓeeₓ)
}
function get_binding_value_from_bindingₓ (eeₓ,eₓ,) {
(resolveₓ(caarₓeeₓ)eₓ)
}
function no_timestamp_binding_Q_ₓ (eeₓ,) {
(isEmptyListₓ(timeₓ(caarₓeeₓ)))
}
function get_rest_of_bindingsₓ (eeₓ,) {
(cdrₓeeₓ)
}
function print_frame_helperₓ (eeₓ,all_bindingsₓ,accumulatorₓ,) {
(condₓ((has_bindings_Q_ₓeeₓ)let var_nameₓ = (get_var_name_from_bindingₓeeₓ);
let binding_valueₓ = (get_binding_value_from_bindingₓeeₓall_bindingsₓ);
let remaining_bindingsₓ = (get_rest_of_bindingsₓeeₓ);
(condₓ((no_timestamp_binding_Q_ₓeeₓ)(print_frame_helperₓremaining_bindingsₓall_bindingsₓ(consₓ(consₓvar_nameₓbinding_valueₓ)accumulatorₓ)))(elseₓ(print_frame_helperₓremaining_bindingsₓall_bindingsₓaccumulatorₓ))))(elseₓaccumulatorₓ))
}
function print_frameₓ (eₓ,) {
let final_resultₓ = (print_frame_helperₓeₓeₓ(constant_nilₓ));
final_resultₓ
}
(defineₓdbₓ(constant_listₓ(constant_listₓ(constant_listₓ(constant_symbolₓ"someₓ")(constant_integerₓ"0ₓ")))(constant_listₓ(constant_listₓ(constant_symbolₓ"someₓ")(constant_integerₓ"10ₓ")))(constant_listₓ(constant_listₓ(constant_symbolₓ"someₓ")(constant_integerₓ"20ₓ")))(constant_listₓ(constant_listₓ(constant_symbolₓ"someₓ")(constant_integerₓ"30ₓ")))(constant_listₓ(constant_listₓ(constant_symbolₓ"eqₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))))(constant_listₓ(constant_listₓ(constant_symbolₓ"neqₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Yₓ")))(constant_listₓ(constant_symbolₓ"eqₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Yₓ")))(constant_symbolₓ"!ₓ")(constant_symbolₓ"failₓ"))(constant_listₓ(constant_listₓ(constant_symbolₓ"neqₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Yₓ"))))))(defineₓgoalsₓ(constant_listₓ(constant_listₓ(constant_symbolₓ"someₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ")))(constant_listₓ(constant_symbolₓ"someₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Yₓ")))(constant_listₓ(constant_symbolₓ"neqₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Yₓ")))(constant_listₓ(constant_symbolₓ"eqₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"@ₓ")(constant_stringₓ"addₓ")(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Xₓ"))(constant_listₓ(constant_stringₓ"?ₓ")(constant_symbolₓ"Yₓ"))))))function resolveArgsₓ (aₓ,bindingsₓ,) {
(resolveArgsHelperₓaₓ(constant_nilₓ)bindingsₓ)
}
function resolveArgsHelperₓ (argsₓ,accumulatorₓ,bindingsₓ,) {
(condₓ((isEmptyListₓargsₓ)accumulatorₓ)(elseₓ(resolveArgsHelperₓ(cdrₓargsₓ)(append2ₓaccumulatorₓ(listₓ(valueₓ(carₓargsₓ)bindingsₓ)))bindingsₓ)))
}
function isForeignₓ (exprₓ,) {
(andₓ(isPairₓexprₓ)(string?ₓ(carₓexprₓ))("@ₓ" == (carₓexprₓ)))
}
function call_foreignₓ (exprₓ,bindingsₓ,) {
let funcₓ = (cadrₓexprₓ);
let argsₓ = (cddrₓexprₓ);
(condₓ(("unityₓ" == funcₓ)(carₓargsₓ))(("addₓ" == funcₓ)let resolved_argsₓ = (resolveArgsₓargsₓbindingsₓ);
((carₓresolved_argsₓ) + (cadrₓresolved_argsₓ)))(("displayₓ" == funcₓ)let aₓ = (valueₓ(carₓargsₓ)bindingsₓ);
(displayₓaₓ))(("newlineₓ" == funcₓ)(newlineₓ))(elseₓ(errorₓ"call_foreignₓ calledₓ withₓ unknownₓ operatorₓ"funcₓ)))
}
(clear_resultₓ)(newlineₓ)(newlineₓ)(prove6ₓ(constant_nilₓ)goalsₓdbₓemptyₓ1ₓ(constant_nilₓ)dbₓ)(display_resultₓ)(newlineₓ)(newlineₓ)
