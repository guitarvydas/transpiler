
function isForeign (expr) {
(isPair (expr)) && (isString (car (expr))) && ("@" == car (expr));
}

function call_foreign (expr, bindings) {
let func = cadr (expr);
let args = cddr (expr);
if ("unity" == func) {
car (args);
} else if ("add" == func) {
let resolved_args = resolveArgs (args, bindings);
car (resolved_args) + cadr (resolved_args);
} else if ("display" == func) {
let a = value (car (args), bindings);
display (a);
} else if ("newline" == func) {
newline ();
} else {
error ("call_foreign&nbsp;called&nbsp;with&nbsp;unknown&nbsp;operator", func);
}

}

clear_result ();
newline ();
newline ();
prove6 (constant_nil (), goals, db, empty, 1, constant_nil (), db);
display_result ();
newline ();
newline ();

