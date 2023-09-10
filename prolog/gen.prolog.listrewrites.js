
function firstₓ ( xₓ,) {
    carₓ ( xₓ,);
}

function restₓ ( xₓ,) {
    cdrₓ ( xₓ,);
}

function append2ₓ ( list1ₓ, list2ₓ,) {
    if (isEmptyListₓ ( list1ₓ,)) {
	list2ₓ;
    } else {
	consₓ ( carₓ ( list1ₓ,), append2ₓ ( cdrₓ ( list1ₓ,), list2ₓ,),);
    }
}

function append3ₓ ( list1ₓ, list2ₓ, list3ₓ,) {
    append2ₓ ( list1ₓ, append2ₓ ( list2ₓ, list3ₓ,),);
}

var result_ₓ = constant_nilₓ ();

function clear_resultₓ () {
    mutateₓ ( result_ₓ, constant_nilₓ (),);
}

function append_to_resultₓ ( lisₓ,) {
    mutateₓ ( result_ₓ, consₓ ( lisₓ, result_ₓ,),);
}

function get_resultₓ () {
    result_ₓ;
}

function display_resultₓ () {
    displayₓ ( get_resultₓ (),);
}

var linkₓ = listₓ;

var L_lₓ = carₓ;

var L_gₓ = cadrₓ;

var L_rₓ = caddrₓ;

var L_eₓ = cadddrₓ;

function L_nₓ ( xₓ,) {
    carₓ ( cddddrₓ ( xₓ,),);
}

function L_cₓ ( xₓ,) {
    cadrₓ ( cddddrₓ ( xₓ,),);
}

function clear_rₓ ( xₓ,) {
    set_car!ₓ ( cddrₓ ( xₓ,), constant_listₓ ( constant_nilₓ (),),);
}

function back6ₓ ( lₓ, gₓ, rₓ, eₓ, nₓ, cₓ, whole_dbₓ,) {
    if (isPairₓ ( gₓ,) && isPairₓ ( rₓ,)) {
	prove6ₓ ( lₓ, gₓ, cdrₓ ( rₓ,), eₓ, nₓ, cₓ, whole_dbₓ,);
    } else if isPairₓ ( lₓ,) {
	prove6ₓ ( L_lₓ ( lₓ,), L_gₓ ( lₓ,), cdrₓ ( L_rₓ ( lₓ,),), L_eₓ ( lₓ,), L_nₓ ( lₓ,), L_cₓ ( lₓ,), whole_dbₓ,);
    }

}

function prove6ₓ ( lₓ, gₓ, rₓ, eₓ, nₓ, cₓ, whole_dbₓ,) {
    if isEmptyListₓ ( gₓ,) {
	let next_resultₓ = print_frameₓ ( eₓ,);
	append_to_resultₓ ( next_resultₓ,);
	back6ₓ ( lₓ, gₓ, rₓ, eₓ, nₓ, cₓ, whole_dbₓ,);
    } else if (constant_symbolₓ ( "!ₓ",) === carₓ ( gₓ,)) {
	clear_rₓ ( cₓ,);
	prove6ₓ ( cₓ, cdrₓ ( gₓ,), rₓ, eₓ, nₓ, cₓ, whole_dbₓ,);
    } else if (constant_symbolₓ ( "r!ₓ",) === carₓ ( gₓ,)) {
	prove6ₓ ( lₓ, cddrₓ ( gₓ,), rₓ, eₓ, nₓ, cadrₓ ( gₓ,), whole_dbₓ,);
    } else if isEmptyListₓ ( rₓ,) {
	if (isEmptyListₓ ( lₓ,)) {
	    trueₓ;
	} else {
	    back6ₓ ( lₓ, gₓ, rₓ, eₓ, nₓ, cₓ, whole_dbₓ,);
	}
    } else if isForeignₓ ( carₓ ( gₓ,),) {
	call_foreignₓ ( carₓ ( gₓ,), eₓ,);
	prove6ₓ ( lₓ, cdrₓ ( gₓ,), rₓ, eₓ, nₓ, cₓ, whole_dbₓ,);
    } else if isForeignₓ ( carₓ ( rₓ,),) {
	call_foreignₓ ( carₓ ( rₓ,), eₓ,);
	prove6ₓ ( lₓ, gₓ, cdrₓ ( rₓ,), eₓ, nₓ, cₓ, whole_dbₓ,);
    } else{
	let aₓ = copyₓ ( carₓ ( rₓ,), nₓ,);
	let eStarₓ = unifyₓ ( carₓ ( aₓ,), carₓ ( gₓ,), eₓ,);
	if (eStarₓ) {
	    prove6ₓ ( linkₓ ( lₓ, gₓ, rₓ, eₓ, nₓ, cₓ,), append3ₓ ( cdrₓ ( aₓ,), listₓ ( constant_symbolₓ ( "r!ₓ",), lₓ,), cdrₓ ( gₓ,),), whole_dbₓ, eStarₓ, (1ₓ + nₓ), lₓ, whole_dbₓ,);
	} else {
	    back6ₓ ( lₓ, gₓ, rₓ, eₓ, nₓ, cₓ, whole_dbₓ,);
	}
    }

}

var emptyₓ = constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "bottomₓ",),),);

var nameₓ = cadrₓ;

var timeₓ = cddrₓ;

function isVarₓ ( xₓ,) {
    andₓ ( isPairₓ ( xₓ,), string?ₓ ( carₓ ( xₓ,),), ("?ₓ" == carₓ ( xₓ,)),);
}

function lookup_loopₓ ( eₓ, idₓ, tmₓ,) {
    if !isPairₓ ( caarₓ ( eₓ,),) {
	falseₓ;
    } else if ((idₓ === nameₓ ( caarₓ ( eₓ,),)) && (tmₓ === timeₓ ( caarₓ ( eₓ,),))) {
	carₓ ( eₓ,);
    } else{
	lookup_loopₓ ( cdrₓ ( eₓ,), idₓ, tmₓ,);
    }

}

function lookupₓ ( vₓ, eₓ,) {
    let idₓ = nameₓ ( vₓ,);let tmₓ = timeₓ ( vₓ,);
    lookup_loopₓ ( eₓ, idₓ, tmₓ,);
}

function valueₓ ( xₓ, eₓ,) {
    if isForeignₓ ( xₓ,) {
	call_foreignₓ ( xₓ, eₓ,);
    } else if isVarₓ ( xₓ,) {
	let vₓ = lookupₓ ( xₓ, eₓ,);
	if (vₓ) {
	    valueₓ ( cadrₓ ( vₓ,), eₓ,);
	} else {
	    xₓ;
	}
    } else{
	xₓ;
    }

}

function copyₓ ( xₓ, nₓ,) {
    if !isPairₓ ( xₓ,) {
	xₓ;
    } else if isVarₓ ( xₓ,) {
	append2ₓ ( xₓ, nₓ,);
    } else{
	consₓ ( copyₓ ( carₓ ( xₓ,), nₓ,), copyₓ ( cdrₓ ( xₓ,), nₓ,),);
    }

}

function bindₓ ( xₓ, yₓ, eₓ,) {
    consₓ ( listₓ ( xₓ, yₓ,), eₓ,);
}

function unifyₓ ( x1ₓ, y1ₓ, eₓ,) {
    let xₓ = valueₓ ( x1ₓ, eₓ,);let yₓ = valueₓ ( y1ₓ, eₓ,);
    if (xₓ === yₓ) {
	eₓ;
    } else if isVarₓ ( xₓ,) {
	bindₓ ( xₓ, yₓ, eₓ,);
    } else if isVarₓ ( yₓ,) {
	bindₓ ( yₓ, xₓ, eₓ,);
    } else if orₓ ( !isPairₓ ( xₓ,), !isPairₓ ( yₓ,),) {
	falseₓ;
    } else{
	let eStarₓ = unifyₓ ( carₓ ( xₓ,), carₓ ( yₓ,), eₓ,);
	(eStarₓ && unifyₓ ( cdrₓ ( xₓ,), cdrₓ ( yₓ,), eStarₓ,));
    }

}

function resolveₓ ( xₓ, eₓ,) {
    if !isPairₓ ( xₓ,) {
	xₓ;
    } else if isVarₓ ( xₓ,) {
	let vₓ = valueₓ ( xₓ, eₓ,);
	if (isVarₓ ( vₓ,)) {
	    vₓ;
	} else {
	    resolveₓ ( vₓ, eₓ,);
	}
    } else{
	consₓ ( resolveₓ ( carₓ ( xₓ,), eₓ,), resolveₓ ( cdrₓ ( xₓ,), eₓ,),);
    }

}

function has_bindings_Q_ₓ ( eeₓ,) {
    isPairₓ ( cdrₓ ( eeₓ,),);
}

function get_var_name_from_bindingₓ ( eeₓ,) {
    cadaarₓ ( eeₓ,);
}

function get_binding_value_from_bindingₓ ( eeₓ, eₓ,) {
    resolveₓ ( caarₓ ( eeₓ,), eₓ,);
}

function no_timestamp_binding_Q_ₓ ( eeₓ,) {
    isEmptyListₓ ( timeₓ ( caarₓ ( eeₓ,),),);
}

function get_rest_of_bindingsₓ ( eeₓ,) {
    cdrₓ ( eeₓ,);
}

function print_frame_helperₓ ( eeₓ, all_bindingsₓ, accumulatorₓ,) {
    if has_bindings_Q_ₓ ( eeₓ,) {
	let var_nameₓ = get_var_name_from_bindingₓ ( eeₓ,);let binding_valueₓ = get_binding_value_from_bindingₓ ( eeₓ, all_bindingsₓ,);let remaining_bindingsₓ = get_rest_of_bindingsₓ ( eeₓ,);
	if no_timestamp_binding_Q_ₓ ( eeₓ,) {
	    print_frame_helperₓ ( remaining_bindingsₓ, all_bindingsₓ, consₓ ( consₓ ( var_nameₓ, binding_valueₓ,), accumulatorₓ,),);
	} else{
	    print_frame_helperₓ ( remaining_bindingsₓ, all_bindingsₓ, accumulatorₓ,);
	}

    } else{
	accumulatorₓ;
    }

}

function print_frameₓ ( eₓ,) {
    let final_resultₓ = print_frame_helperₓ ( eₓ, eₓ, constant_nilₓ (),);
    final_resultₓ;
}

var dbₓ = constant_listₓ ( constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "someₓ",), constant_integerₓ ( "0ₓ",),),), constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "someₓ",), constant_integerₓ ( "10ₓ",),),), constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "someₓ",), constant_integerₓ ( "20ₓ",),),), constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "someₓ",), constant_integerₓ ( "30ₓ",),),), constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "eqₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),),),), constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "neqₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Yₓ",),),), constant_listₓ ( constant_symbolₓ ( "eqₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Yₓ",),),), constant_symbolₓ ( "!ₓ",), constant_symbolₓ ( "failₓ",),), constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "neqₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Yₓ",),),),),);

var goalsₓ = constant_listₓ ( constant_listₓ ( constant_symbolₓ ( "someₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),),), constant_listₓ ( constant_symbolₓ ( "someₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Yₓ",),),), constant_listₓ ( constant_symbolₓ ( "neqₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Yₓ",),),), constant_listₓ ( constant_symbolₓ ( "eqₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "@ₓ",), constant_stringₓ ( "addₓ",), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Xₓ",),), constant_listₓ ( constant_stringₓ ( "?ₓ",), constant_symbolₓ ( "Yₓ",),),),),);

function resolveArgsₓ ( aₓ, bindingsₓ,) {
    resolveArgsHelperₓ ( aₓ, constant_nilₓ (), bindingsₓ,);
}

function resolveArgsHelperₓ ( argsₓ, accumulatorₓ, bindingsₓ,) {
    if isEmptyListₓ ( argsₓ,) {
	accumulatorₓ;
    } else{
	resolveArgsHelperₓ ( cdrₓ ( argsₓ,), append2ₓ ( accumulatorₓ, listₓ ( valueₓ ( carₓ ( argsₓ,), bindingsₓ,),),), bindingsₓ,);
    }

}

function isForeignₓ ( exprₓ,) {
    andₓ ( isPairₓ ( exprₓ,), string?ₓ ( carₓ ( exprₓ,),), ("@ₓ" == carₓ ( exprₓ,)),);
}

function call_foreignₓ ( exprₓ, bindingsₓ,) {
    let funcₓ = cadrₓ ( exprₓ,);let argsₓ = cddrₓ ( exprₓ,);
    if ("unityₓ" == funcₓ) {
	carₓ ( argsₓ,);
    } else if ("addₓ" == funcₓ) {
	let resolved_argsₓ = resolveArgsₓ ( argsₓ, bindingsₓ,);
	(carₓ ( resolved_argsₓ,) + cadrₓ ( resolved_argsₓ,));
    } else if ("displayₓ" == funcₓ) {
	let aₓ = valueₓ ( carₓ ( argsₓ,), bindingsₓ,);
	displayₓ ( aₓ,);
    } else if ("newlineₓ" == funcₓ) {
	newlineₓ ();
    } else{
	errorₓ ( "call_foreignₓ calledₓ withₓ unknownₓ operatorₓ", funcₓ,);
    }

}

clear_resultₓ ();
newlineₓ ();
newlineₓ ();
prove6ₓ ( constant_nilₓ (), goalsₓ, dbₓ, emptyₓ, 1ₓ, constant_nilₓ (), dbₓ,);
display_resultₓ ();
newlineₓ ();
newlineₓ ();
