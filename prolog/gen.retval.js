function first (x) {
let _0 = undefined;
_0 = car(x);
return _0;
}
function rest (x) {
let _0 = undefined;
_0 = cdr(x);
return _0;
}
function append2 (list1, list2) {
let _0 = undefined;
let _1 = undefined;
if (isEmptyList(list1)){
_1 = list2;
} else {
_1 = cons(car(list1), append2(cdr(list1), list2));
}
_0 = _1;
return _0;
}
function append3 (list1, list2, list3) {
let _0 = undefined;
_0 = append2(list1, append2(list2, list3));
return _0;
}
varresult_=constant_nil();function clear_result () {
let _0 = undefined;
_0 = mutate(result_, constant_nil());
return _0;
}
function append_to_result (lis) {
let _0 = undefined;
_0 = mutate(result_, cons(lis, result_));
return _0;
}
function get_result () {
let _0 = undefined;
_0 = result_;
return _0;
}
function display_result () {
let _0 = undefined;
_0 = display(get_result());
return _0;
}
varlink=list;varL_l=car;varL_g=cadr;varL_r=caddr;varL_e=cadddr;function L_n (x) {
let _0 = undefined;
_0 = car(cddddr(x));
return _0;
}
function L_c (x) {
let _0 = undefined;
_0 = cadr(cddddr(x));
return _0;
}
function clear_r (x) {
let _0 = undefined;
_0 = mutate_car(cddr(x), constant_list(constant_nil()));
return _0;
}
function back6 (l, g, r, e, n, c, whole_db) {
let _0 = undefined;
let _1 = undefined;
if ((isPair(g)) && (isPair(r))){
_1 = prove6(l, g, cdr(r), e, n, c, whole_db);
} else if (isPair(l)){
_1 = prove6(L_l(l), L_g(l), cdr(L_r(l)), L_e(l), L_n(l), L_c(l), whole_db);
}
_0 = _1;
return _0;
}
function prove6 (l, g, r, e, n, c, whole_db) {
let _0 = undefined;
let _1 = undefined;
if (isEmptyList(g)){
let next_result = print_frame(e);
_1 = append_to_result(next_result);
_1 = back6(l, g, r, e, n, c, whole_db);
} else if (constant_symbol("!") === car(g)){
_1 = clear_r(c);
_1 = prove6(c, cdr(g), r, e, n, c, whole_db);
} else if (constant_symbol("r!") === car(g)){
_1 = prove6(l, cddr(g), r, e, n, cadr(g), whole_db);
} else if (isEmptyList(r)){
let _2 = undefined;
if (isEmptyList(l)){
_2 = true;
} else {
_2 = back6(l, g, r, e, n, c, whole_db);
}
_1 = _2;
} else if (isForeign(car(g))){
_1 = call_foreign(car(g), e);
_1 = prove6(l, cdr(g), r, e, n, c, whole_db);
} else if (isForeign(car(r))){
_1 = call_foreign(car(r), e);
_1 = prove6(l, g, cdr(r), e, n, c, whole_db);
} else {
let a = copy(car(r), n);
let eStar = unify(car(a), car(g), e);
let _2 = undefined;
if (eStar){
_2 = prove6(link(l, g, r, e, n, c), append3(cdr(a), list(constant_symbol("r!"), l), cdr(g)), whole_db, eStar, 1 + n, l, whole_db);
} else {
_2 = back6(l, g, r, e, n, c, whole_db);
}
_1 = _2;
}
_0 = _1;
return _0;
}
varempty=constant_list(constant_list(constant_symbol("bottom")));varname=cadr;vartime=cddr;function isVar (x) {
let _0 = undefined;
_0 = (isPair(x)) && (isString(car(x))) && ("?" == car(x));
return _0;
}
function lookup_loop (e, id, tm) {
let _0 = undefined;
let _1 = undefined;
if (!isPair(caar(e))){
_1 = false;
} else if ((id === name(caar(e))) && (tm === time(caar(e)))){
_1 = car(e);
} else {
_1 = lookup_loop(cdr(e), id, tm);
}
_0 = _1;
return _0;
}
function lookup (v, e) {
let _0 = undefined;
let id = name(v);
let tm = time(v);
_0 = lookup_loop(e, id, tm);
return _0;
}
function value (x, e) {
let _0 = undefined;
let _1 = undefined;
if (isForeign(x)){
_1 = call_foreign(x, e);
} else if (isVar(x)){
let v = lookup(x, e);
let _2 = undefined;
if (v){
_2 = value(cadr(v), e);
} else {
_2 = x;
}
_1 = _2;
} else {
_1 = x;
}
_0 = _1;
return _0;
}
function copy (x, n) {
let _0 = undefined;
let _1 = undefined;
if (!isPair(x)){
_1 = x;
} else if (isVar(x)){
_1 = append2(x, n);
} else {
_1 = cons(copy(car(x), n), copy(cdr(x), n));
}
_0 = _1;
return _0;
}
function bind (x, y, e) {
let _0 = undefined;
_0 = cons(list(x, y), e);
return _0;
}
function unify (x1, y1, e) {
let _0 = undefined;
let x = value(x1, e);
let y = value(y1, e);
let _1 = undefined;
if (x === y){
_1 = e;
} else if (isVar(x)){
_1 = bind(x, y, e);
} else if (isVar(y)){
_1 = bind(y, x, e);
} else if (or(!isPair(x), !isPair(y))){
_1 = false;
} else {
let eStar = unify(car(x), car(y), e);
_1 = (eStar) && (unify(cdr(x), cdr(y), eStar));
}
_0 = _1;
return _0;
}
function resolve (x, e) {
let _0 = undefined;
let _1 = undefined;
if (!isPair(x)){
_1 = x;
} else if (isVar(x)){
let v = value(x, e);
let _2 = undefined;
if (isVar(v)){
_2 = v;
} else {
_2 = resolve(v, e);
}
_1 = _2;
} else {
_1 = cons(resolve(car(x), e), resolve(cdr(x), e));
}
_0 = _1;
return _0;
}
function has_bindings_Q_ (ee) {
let _0 = undefined;
_0 = isPair(cdr(ee));
return _0;
}
function get_var_name_from_binding (ee) {
let _0 = undefined;
_0 = cadaar(ee);
return _0;
}
function get_binding_value_from_binding (ee, e) {
let _0 = undefined;
_0 = resolve(caar(ee), e);
return _0;
}
function no_timestamp_binding_Q_ (ee) {
let _0 = undefined;
_0 = isEmptyList(time(caar(ee)));
return _0;
}
function get_rest_of_bindings (ee) {
let _0 = undefined;
_0 = cdr(ee);
return _0;
}
function print_frame_helper (ee, all_bindings, accumulator) {
let _0 = undefined;
let _1 = undefined;
if (has_bindings_Q_(ee)){
let var_name = get_var_name_from_binding(ee);
let binding_value = get_binding_value_from_binding(ee, all_bindings);
let remaining_bindings = get_rest_of_bindings(ee);
let _2 = undefined;
if (no_timestamp_binding_Q_(ee)){
_2 = print_frame_helper(remaining_bindings, all_bindings, cons(cons(var_name, binding_value), accumulator));
} else {
_2 = print_frame_helper(remaining_bindings, all_bindings, accumulator);
}
_1 = _2;
} else {
_1 = accumulator;
}
_0 = _1;
return _0;
}
function print_frame (e) {
let _0 = undefined;
let final_result = print_frame_helper(e, e, constant_nil());
_0 = final_result;
return _0;
}
vardb=constant_list(constant_list(constant_list(constant_symbol("some"), constant_integer("0"))), constant_list(constant_list(constant_symbol("some"), constant_integer("10"))), constant_list(constant_list(constant_symbol("some"), constant_integer("20"))), constant_list(constant_list(constant_symbol("some"), constant_integer("30"))), constant_list(constant_list(constant_symbol("eq"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("?"), constant_symbol("X")))), constant_list(constant_list(constant_symbol("neq"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("?"), constant_symbol("Y"))), constant_list(constant_symbol("eq"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("?"), constant_symbol("Y"))), constant_symbol("!"), constant_symbol("fail")), constant_list(constant_list(constant_symbol("neq"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("?"), constant_symbol("Y")))));vargoals=constant_list(constant_list(constant_symbol("some"), constant_list(constant_string("?"), constant_symbol("X"))), constant_list(constant_symbol("some"), constant_list(constant_string("?"), constant_symbol("Y"))), constant_list(constant_symbol("neq"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("?"), constant_symbol("Y"))), constant_list(constant_symbol("eq"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("@"), constant_string("add"), constant_list(constant_string("?"), constant_symbol("X")), constant_list(constant_string("?"), constant_symbol("Y")))));function resolveArgs (a, bindings) {
let _0 = undefined;
_0 = resolveArgsHelper(a, constant_nil(), bindings);
return _0;
}
function resolveArgsHelper (args, accumulator, bindings) {
let _0 = undefined;
let _1 = undefined;
if (isEmptyList(args)){
_1 = accumulator;
} else {
_1 = resolveArgsHelper(cdr(args), append2(accumulator, list(value(car(args), bindings))), bindings);
}
_0 = _1;
return _0;
}
function isForeign (expr) {
let _0 = undefined;
_0 = (isPair(expr)) && (isString(car(expr))) && ("@" == car(expr));
return _0;
}
function call_foreign (expr, bindings) {
let _0 = undefined;
let func = cadr(expr);
let args = cddr(expr);
let _1 = undefined;
if ("unity" == func){
_1 = car(args);
} else if ("add" == func){
let resolved_args = resolveArgs(args, bindings);
_1 = car(resolved_args) + cadr(resolved_args);
} else if ("display" == func){
let a = value(car(args), bindings);
_1 = display(a);
} else if ("newline" == func){
_1 = newline();
} else {
_1 = error("call_foreign&nbsp;called&nbsp;with&nbsp;unknown&nbsp;operator", func);
}
_0 = _1;
return _0;
}
let _0 = undefined;
_0 = clear_result();
_0 = newline();
_0 = newline();
_0 = prove6(constant_nil(), goals, db, empty, 1, constant_nil(), db);
_0 = display_result();
_0 = newline();
_0 = newline();
