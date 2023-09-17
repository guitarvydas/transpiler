// first-cut version (no optimization yet)
//
// a Cons cell is an object {car, cdr, isPair, toString}
// nil is "nil"
//
// a List is a chain of Cons cells, the data for a cell is stored in the car, and a pointer to the next cell is in the cdr
// the last cell in a chain contains "nil" as its cdr
/////

function Cons(car,cdr) { 
    this.car = car;
    this.cdr = cdr;
    this.isPair = true;
    this.toString = function() {  // returns string (a b) or (a . b) with appropriate trailing space in the possible presence of javascript errors (null and undefined)
	return cellToStr(this);
   }
};

function car(cell) {
    return cell.car;
}
function cdr(cell) {
    return cell.cdr;
}
function cddr(cell) {
    return cdr(cdr(cell));
}
function cdddr(cell) {
    return cdr(cdr(cdr(cell)));
}
function cddddr(cell) {
    return cdr(cdr(cdr(cdr(cell))));
}
function cdddddr(cell) {
    return cdr(cdr(cdr(cdr(cdr(cell)))))
}

function caar (cell) {
    return car(car(cell));
}

function cadr (cell) {
    return car(cdr(cell));
}

function caddr (cell) {
    return car(cddr(cell));
}

function cadddr (cell) {
    return car(cdddr(cell));
}

function caddddr (cell) {
    return car(cddddr(cell));
}

function cadaar (cell) {
    return car(cdr(car(car(cell))));
}

function cons(x,y) {
    if (x == undefined && y == undefined) {
	return "nil";
    } else if (y == undefined) {
	return new Cons(x,"nil");
    } else {
	return new Cons(x,y);
    }
}

function list() {
    var result = "nil";
    for(var i = (arguments.length-1); i >= 0 ; i--) {
	result = cons (arguments[i], result);
    }
    return result;
}

function isEmptyList (x) {
    if (x == "nil") {
	return true;
    } else if (x.isPair) {
	return false;
    } else {
	return false;
    }
}


function isPair (x) {
    // Scheme doesn't like truthiness or falsiness, it wants true or false
    if (!x) {
	return false;
    } else if (x.isPair) {
	return true;
    } else {
	return false;
    }
}
function toDebug (x) {
    console.log("toDebug x=");
    console.log(x);
    if (x == "nil") {
	return "()";
    } else if (x == null) {
	return "NULL";
    } else if (x == undefined) {
	return "UNDEFINED";
    } else {
	return x.toString();
    }
}
function isString (s) {
    return s && ("string" == typeof(s));
}

function mutate_car (l,v) { l.car = v; }

function newline () { process.stdout.write("\n"); }
function display(x) { 
    if (x == "nil") {
	process.stdout.write("nil");
    } else if (x == undefined) {
	process.stdout.write("undefined");
    } else {
	process.stdout.write(x.toString()); 
    }
}

/// additions Sept. 12, 2023

function constant_nil () { return "nil"; }

var constant_list = list;

function constant_string (s) { return s; }

function constant_symbol (s) { return constant_string (s); }

function constant_integer (s) { return parseInt (s); }

////



// utility functions for Cons.toString()
function isNil(x) {
    if ("string" == typeof(x)) {
	if ("nil" == x) {
	    return true;
	} else {
	    return false;
	}
    } else {
	return false;
    }
}
function isCons (maybeCell) {
    if ("object" == typeof(maybeCell)) {
	if (maybeCell.isPair) {
	    return true;
	} else {
	    return false;
	}
    } else {
	return false;
    }
}
function carItemToString(x) {
    if (x == undefined) {
	return "error(undefined)";
    } else if (x == null) {
	return "error(null)";
    } else if (isNil(x)) {
	return "nil";
    } else if (isCons(x)) {
	return x.toString();
    } else {
	return x.toString();
    }
}
function cdrItemToString(x) {
    if (x == undefined) {
	return "error(undefined)";
    } else if (x == null) {
	return "error(null)";
    } else if (isNil(x)) {
	return "";
    } else if (isCons(x)) {
	return "";
    } else {
	return x.toString();
    }
}

function toSpacer(x) { // return " . " if cell contains a non-nil/non-next-cell item, return " " if end-of-list, else return ""
    // more edge cases than Lisp or Scheme because of undefined and null, and I've decided to make nil be "nil"
    if (x == undefined) {
	return " ";
    } else if (x == null) {
	return " ";
    } else if ( ("object" == typeof(x) && x.isPair) ) {
	if ( ("object" == typeof(x.cdr)) ) {
	    return " ";
	} else if (isNil(x.cdr)) {
	    return "";
	} else {
	    return " . ";
	}
    } else {
	throw "can't happen";
    }
}

function toTrailingSpace(x) { // return " " if end of list, else ""
    // more edge cases than Lisp or Scheme because of undefined and null, and I've decided to make nil be "nil"
    if (x == undefined) {
	return " ";
    } else if (x == null) {
	return " ";
    } else if ( ("object" == typeof(x) && x.isPair) ) {
	if ( ("object" == typeof(x.cdr)) ) {
	    return " ";
	} else if (isNil(x.cdr)) {
	    return "";
	} else {
	    return "";
	}
    } else {
	throw "can't happen";
    }
}


function continueCDRing(maybeCell) {  // if x.cdr is another Cons, return true, if it's "nil" return false, if it's a primitive return false, else return false
    // more edge cases than Lisp or Scheme because of undefined and null, and I've decided to make nil be "nil"
    // x should be a Cons cell or "nil" or a primitive, but it might be null or undefined (an internal error that I want to see)
    if (maybeCell == undefined) {
	return false;
    } else if (maybeCell == null) {
	return false;
    } else if (isNil(maybeCell)) {
	return false;
    } else if (isCons(maybeCell)) {  // a Cons cell
	let next = cdr(maybeCell);
	if (isCons(next)) {
	    return true;
	} else {
	    return false;
	}
    } else if ("object" == typeof(maybeCell)) {
	return false;
    } else {
	return false;
    }
}
function nextCell(maybeCell) { // return cdr of cell if we are to continue (determined by continueCDRing function, above), else return undefined
    // more edge cases than Lisp or Scheme because of undefined and null, and I've decided to make nil be "nil"
    // x should be a Cons cell or "nil" or a primitive, but it might be null or undefined (an internal error that I want to see)
    if (maybeCell == undefined) {
	return undefined;
    } else if (maybeCell == null) {
	return undefined;
    } else if (isNil(maybeCell)) {
	return undefined;
    } else if (isCons(maybeCell)) {
	return cdr(maybeCell);  // this will return a Cons or might return "nil" if at end of list
    } else if ("object" == typeof(maybeCell)) {
	return undefined;
    } else {
	return undefined;
    }
}
function cellToStr(cell) {
    let str = "(";
    let keepGoing = true;
    while (keepGoing) {
	let a = carItemToString(car(cell));
	let d = cdrItemToString(cdr(cell));
	let spacer = toSpacer(cell);
	let trailer = toTrailingSpace(cell);
	str = str + a + spacer + d + trailer;
	keepGoing = continueCDRing(cell);
	cell = nextCell(cell);
    }
    return str + ")";
}

function undef () { return undefined; }
function first (x,) {
let _0 = undef ();
_0 = car(x);
return (_0);
}

function rest (x,) {
let _0 = undef ();
_0 = cdr(x);
return (_0);
}

function append2 (list1, list2,) {
let _0 = undef ();
let _1 = undef ();
if (isEmptyList (list1)) {
_1 = list2;
} else {
_1 = cons(car (list1), append2 (cdr (list1), list2));
}
_0 = _1;
return (_0);
}

function append3 (list1, list2, list3,) {
let _0 = undef ();
_0 = append2(list1, append2 (list2, list3));
return (_0);
}

var result_ = constant_nil ();

_0 = result_;
function clear_result () {
let _0 = undef ();
_0 = result_ = constant_nil();
return (_0);
}

function append_to_result (lis,) {
let _0 = undef ();
_0 = result_ = cons(lis, result_);
return (_0);
}

function get_result () {
let _0 = undef ();
_0 = result_;
return (_0);
}

function display_result () {
let _0 = undef ();
_0 = display(get_result ());
return (_0);
}

var link = list;

_0 = link;
var L_l = car;

_0 = L_l;
var L_g = cadr;

_0 = L_g;
var L_r = caddr;

_0 = L_r;
var L_e = cadddr;

_0 = L_e;
function L_n (x,) {
let _0 = undef ();
_0 = car(cddddr (x));
return (_0);
}

function L_c (x,) {
let _0 = undef ();
_0 = cadr(cddddr (x));
return (_0);
}

function clear_r (x,) {
let _0 = undef ();
_0 = mutate_car(cddr (x), constant_list (constant_nil ()));
return (_0);
}

function back6 (l, g, r, e, n, c, whole_db,) {
let _0 = undef ();
let _1 = undef ();
if ((isPair (g)) && (isPair (r))) {
_1 = prove6(l, g, cdr (r), e, n, c, whole_db);
} else if (isPair (l)) {
_1 = prove6(L_l (l), L_g (l), cdr (L_r (l)), L_e (l), L_n (l), L_c (l), whole_db);
}

_0 = _1;
return (_0);
}

function prove6 (l, g, r, e, n, c, whole_db,) {
let _0 = undef ();
let _1 = undef ();
if (isEmptyList (g)) {
let next_result = print_frame (e);
_1 = append_to_result(next_result);
_1 = back6(l, g, r, e, n, c, whole_db);
} else if (constant_symbol ("!") === car (g)) {
_1 = clear_r(c);
_1 = prove6(c, cdr (g), r, e, n, c, whole_db);
} else if (constant_symbol ("r!") === car (g)) {
_1 = prove6(l, cddr (g), r, e, n, cadr (g), whole_db);
} else if (isEmptyList (r)) {
let _2 = undef ();
if (isEmptyList (l)) {
_2 = true;
} else {
_2 = back6(l, g, r, e, n, c, whole_db);
}
_1 = _2;
} else if (isForeign (car (g))) {
_1 = call_foreign(car (g), e);
_1 = prove6(l, cdr (g), r, e, n, c, whole_db);
} else if (isForeign (car (r))) {
_1 = call_foreign(car (r), e);
_1 = prove6(l, g, cdr (r), e, n, c, whole_db);
} else {
let a = copy (car (r), n);
let eStar = unify (car (a), car (g), e);
let _2 = undef ();
if (eStar) {
_2 = prove6(link (l, g, r, e, n, c), append3 (cdr (a), list (constant_symbol ("r!"), l), cdr (g)), whole_db, eStar, 1 + n, l, whole_db);
} else {
_2 = back6(l, g, r, e, n, c, whole_db);
}
_1 = _2;
}

_0 = _1;
return (_0);
}

var empty = constant_list (constant_list (constant_symbol ("bottom")));

_0 = empty;
var name = cadr;

_0 = name;
var time = cddr;

_0 = time;
function isVar (x,) {
let _0 = undef ();
_0 = (isPair (x))&&(isString (car (x)))&&("?" == car (x));
return (_0);
}

function lookup_loop (e, id, tm,) {
let _0 = undef ();
let _1 = undef ();
if (!isPair (caar (e))) {
_1 = false;
} else if ((id === name (caar (e))) && (tm === time (caar (e)))) {
_1 = car(e);
} else {
_1 = lookup_loop(cdr (e), id, tm);
}

_0 = _1;
return (_0);
}

function lookup (v, e,) {
let _0 = undef ();
let id = name (v);
let tm = time (v);
_0 = lookup_loop(e, id, tm);
return (_0);
}

function value (x, e,) {
let _0 = undef ();
let _1 = undef ();
if (isForeign (x)) {
_1 = call_foreign(x, e);
} else if (isVar (x)) {
let v = lookup (x, e);
let _2 = undef ();
if (v) {
_2 = value(cadr (v), e);
} else {
_2 = x;
}
_1 = _2;
} else {
_1 = x;
}

_0 = _1;
return (_0);
}

function copy (x, n,) {
let _0 = undef ();
let _1 = undef ();
if (!isPair (x)) {
_1 = x;
} else if (isVar (x)) {
_1 = append2(x, n);
} else {
_1 = cons(copy (car (x), n), copy (cdr (x), n));
}

_0 = _1;
return (_0);
}

function bind (x, y, e,) {
let _0 = undef ();
_0 = cons(list (x, y), e);
return (_0);
}

function unify (x1, y1, e,) {
let _0 = undef ();
let x = value (x1, e);
let y = value (y1, e);
let _1 = undef ();
if (x === y) {
_1 = e;
} else if (isVar (x)) {
_1 = bind(x, y, e);
} else if (isVar (y)) {
_1 = bind(y, x, e);
} else if ((!isPair (x)) || (!isPair (y))) {
_1 = false;
} else {
let eStar = unify (car (x), car (y), e);
_1 = (eStar)&&(unify (cdr (x), cdr (y), eStar));
}

_0 = _1;
return (_0);
}

function resolve (x, e,) {
let _0 = undef ();
let _1 = undef ();
if (!isPair (x)) {
_1 = x;
} else if (isVar (x)) {
let v = value (x, e);
let _2 = undef ();
if (isVar (v)) {
_2 = v;
} else {
_2 = resolve(v, e);
}
_1 = _2;
} else {
_1 = cons(resolve (car (x), e), resolve (cdr (x), e));
}

_0 = _1;
return (_0);
}

function has_bindings_Q_ (ee,) {
let _0 = undef ();
_0 = isPair(cdr (ee));
return (_0);
}

function get_var_name_from_binding (ee,) {
let _0 = undef ();
_0 = cadaar(ee);
return (_0);
}

function get_binding_value_from_binding (ee, e,) {
let _0 = undef ();
_0 = resolve(caar (ee), e);
return (_0);
}

function no_timestamp_binding_Q_ (ee,) {
let _0 = undef ();
_0 = isEmptyList(time (caar (ee)));
return (_0);
}

function get_rest_of_bindings (ee,) {
let _0 = undef ();
_0 = cdr(ee);
return (_0);
}

function print_frame_helper (ee, all_bindings, accumulator,) {
let _0 = undef ();
let _1 = undef ();
if (has_bindings_Q_ (ee)) {
let var_name = get_var_name_from_binding (ee);
let binding_value = get_binding_value_from_binding (ee, all_bindings);
let remaining_bindings = get_rest_of_bindings (ee);
let _2 = undef ();
if (no_timestamp_binding_Q_ (ee)) {
_2 = print_frame_helper(remaining_bindings, all_bindings, cons (cons (var_name, binding_value), accumulator));
} else {
_2 = print_frame_helper(remaining_bindings, all_bindings, accumulator);
}

_1 = _2;
} else {
_1 = accumulator;
}

_0 = _1;
return (_0);
}

function print_frame (e,) {
let _0 = undef ();
let final_result = print_frame_helper (e, e, constant_nil ());
_0 = final_result;
return (_0);
}

var db = constant_list (constant_list (constant_list (constant_symbol ("some"), constant_integer ("0"))), constant_list (constant_list (constant_symbol ("some"), constant_integer ("10"))), constant_list (constant_list (constant_symbol ("some"), constant_integer ("20"))), constant_list (constant_list (constant_symbol ("some"), constant_integer ("30"))), constant_list (constant_list (constant_symbol ("eq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("X")))), constant_list (constant_list (constant_symbol ("neq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_list (constant_symbol ("eq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_symbol ("!"), constant_symbol ("fail")), constant_list (constant_list (constant_symbol ("neq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y")))));

_0 = db;
var goals = constant_list (constant_list (constant_symbol ("some"), constant_list (constant_string ("?"), constant_symbol ("X"))), constant_list (constant_symbol ("some"), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_list (constant_symbol ("neq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_list (constant_symbol ("eq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("@"), constant_string ("add"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y")))));

_0 = goals;
function resolveArgs (a, bindings,) {
let _0 = undef ();
_0 = resolveArgsHelper(a, constant_nil (), bindings);
return (_0);
}

function resolveArgsHelper (args, accumulator, bindings,) {
let _0 = undef ();
let _1 = undef ();
if (isEmptyList (args)) {
_1 = accumulator;
} else {
_1 = resolveArgsHelper(cdr (args), append2 (accumulator, list (value (car (args), bindings))), bindings);
}

_0 = _1;
return (_0);
}

function isForeign (expr,) {
let _0 = undef ();
_0 = (isPair (expr))&&(isString (car (expr)))&&("@" == car (expr));
return (_0);
}

function call_foreign (expr, bindings,) {
let _0 = undef ();
let func = cadr (expr);
let args = cddr (expr);
let _1 = undef ();
if ("unity" == func) {
_1 = car(args);
} else if ("add" == func) {
let resolved_args = resolveArgs (args, bindings);
_1 = car(resolved_args)+cadr(resolved_args);
} else if ("display" == func) {
let a = value (car (args), bindings);
_1 = display(a);
} else if ("newline" == func) {
_1 = newline();
} else {
_1 = error("call_foreign&nbsp;called&nbsp;with&nbsp;unknown&nbsp;operator", func);
}

_0 = _1;
return (_0);
}

_0 = clear_result();
_0 = newline();
_0 = newline();
_0 = prove6(constant_nil (), goals, db, empty, 1, constant_nil (), db);
_0 = display_result();
_0 = newline();
_0 = newline();
