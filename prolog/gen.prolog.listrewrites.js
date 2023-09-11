
function isForeignₓ ( exprₓ,) {
(isPairₓ ( exprₓ,)) && (isStringₓ ( carₓ ( exprₓ,),)) && ("@ₓ" == carₓ ( exprₓ,));
}

function call_foreignₓ ( exprₓ, bindingsₓ,) {
let funcₓ = cadrₓ ( exprₓ,);
let argsₓ = cddrₓ ( exprₓ,);
if ("unityₓ" == funcₓ) {
carₓ ( argsₓ,);
} else if ("addₓ" == funcₓ) {
let resolved_argsₓ = resolveArgsₓ ( argsₓ, bindingsₓ,);
carₓ ( resolved_argsₓ,) + cadrₓ ( resolved_argsₓ,);
} else if ("displayₓ" == funcₓ) {
let aₓ = valueₓ ( carₓ ( argsₓ,), bindingsₓ,);
displayₓ ( aₓ,);
} else if ("newlineₓ" == funcₓ) {
newlineₓ ();
} else {
errorₓ ( "call_foreignₓ&nbsp;calledₓ&nbsp;withₓ&nbsp;unknownₓ&nbsp;operatorₓ", funcₓ,);
}

}

clear_resultₓ ();
newlineₓ ();
newlineₓ ();
prove6ₓ ( constant_nilₓ (), goalsₓ, dbₓ, emptyₓ, 1ₓ, constant_nilₓ (), dbₓ,);
display_resultₓ ();
newlineₓ ();
newlineₓ ();
