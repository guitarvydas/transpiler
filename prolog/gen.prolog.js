
function first (x) {
    car (x);
}

function rest (x) {
    cdr (x);
}

function append2 (list1, list2) {
    if (isEmptyList (list1)) {
	list2;
    } else {
	cons (car (list1), append2 (cdr (list1), list2));
    }
}

function append3 (list1, list2, list3) {
    append2 (list1, append2 (list2, list3));
}

var result_ = constant_nil ();

function clear_result () {
    mutate (result_, constant_nil ());
}

function append_to_result (lis) {
    mutate (result_, cons (lis, result_));
}

function get_result () {
    result_;
}

function display_result () {
    display (get_result ());
}

var link = list;

var L_l = car;

var L_g = cadr;

var L_r = caddr;

var L_e = cadddr;

function L_n (x) {
    car (cddddr (x));
}

function L_c (x) {
    cadr (cddddr (x));
}

function clear_r (x) {
    mutate_car (cddr (x), constant_list (constant_nil ()));
}

function back6 (l, g, r, e, n, c, whole_db) {
    if ((isPair (g)) && (isPair (r))) {
	prove6 (l, g, cdr (r), e, n, c, whole_db);
    } else if (isPair (l)) {
	prove6 (L_l (l), L_g (l), cdr (L_r (l)), L_e (l), L_n (l), L_c (l), whole_db);
    }

}

function prove6 (l, g, r, e, n, c, whole_db) {
    if (isEmptyList (g)) {
	let next_result = print_frame (e);
	append_to_result (next_result);
	back6 (l, g, r, e, n, c, whole_db);
    } else if (constant_symbol ("!") === car (g)) {
	clear_r (c);
	prove6 (c, cdr (g), r, e, n, c, whole_db);
    } else if (constant_symbol ("r!") === car (g)) {
	prove6 (l, cddr (g), r, e, n, cadr (g), whole_db);
    } else if (isEmptyList (r)) {
	if (isEmptyList (l)) {
	    true;
	} else {
	    back6 (l, g, r, e, n, c, whole_db);
	}
    } else if (isForeign (car (g))) {
	call_foreign (car (g), e);
	prove6 (l, cdr (g), r, e, n, c, whole_db);
    } else if (isForeign (car (r))) {
	call_foreign (car (r), e);
	prove6 (l, g, cdr (r), e, n, c, whole_db);
    } else {
	let a = copy (car (r), n);
	let eStar = unify (car (a), car (g), e);
	if (eStar) {
	    prove6 (link (l, g, r, e, n, c), append3 (cdr (a), list (constant_symbol ("r!"), l), cdr (g)), whole_db, eStar, 1 + n, l, whole_db);
	} else {
	    back6 (l, g, r, e, n, c, whole_db);
	}
    }

}

var empty = constant_list (constant_list (constant_symbol ("bottom")));

var name = cadr;

var time = cddr;

function isVar (x) {
    (isPair (x)) && (isString (car (x))) && ("?" == car (x));
}

function lookup_loop (e, id, tm) {
    if (!isPair (caar (e))) {
	false;
    } else if ((id === name (caar (e))) && (tm === time (caar (e)))) {
	car (e);
    } else {
	lookup_loop (cdr (e), id, tm);
    }

}

function lookup (v, e) {
    let id = name (v);
    let tm = time (v);
    lookup_loop (e, id, tm);
}

function value (x, e) {
    if (isForeign (x)) {
	call_foreign (x, e);
    } else if (isVar (x)) {
	let v = lookup (x, e);
	if (v) {
	    value (cadr (v), e);
	} else {
	    x;
	}
    } else {
	x;
    }

}

function copy (x, n) {
    if (!isPair (x)) {
	x;
    } else if (isVar (x)) {
	append2 (x, n);
    } else {
	cons (copy (car (x), n), copy (cdr (x), n));
    }

}

function bind (x, y, e) {
    cons (list (x, y), e);
}

function unify (x1, y1, e) {
    let x = value (x1, e);
    let y = value (y1, e);
    if (x === y) {
	e;
    } else if (isVar (x)) {
	bind (x, y, e);
    } else if (isVar (y)) {
	bind (y, x, e);
    } else if (or (!isPair (x), !isPair (y))) {
	false;
    } else {
	let eStar = unify (car (x), car (y), e);
	(eStar) && (unify (cdr (x), cdr (y), eStar));
    }

}

function resolve (x, e) {
    if (!isPair (x)) {
	x;
    } else if (isVar (x)) {
	let v = value (x, e);
	if (isVar (v)) {
	    v;
	} else {
	    resolve (v, e);
	}
    } else {
	cons (resolve (car (x), e), resolve (cdr (x), e));
    }

}

function has_bindings_Q_ (ee) {
    isPair (cdr (ee));
}

function get_var_name_from_binding (ee) {
    cadaar (ee);
}

function get_binding_value_from_binding (ee, e) {
    resolve (caar (ee), e);
}

function no_timestamp_binding_Q_ (ee) {
    isEmptyList (time (caar (ee)));
}

function get_rest_of_bindings (ee) {
    cdr (ee);
}

function print_frame_helper (ee, all_bindings, accumulator) {
    if (has_bindings_Q_ (ee)) {
	let var_name = get_var_name_from_binding (ee);
	let binding_value = get_binding_value_from_binding (ee, all_bindings);
	let remaining_bindings = get_rest_of_bindings (ee);
	if (no_timestamp_binding_Q_ (ee)) {
	    print_frame_helper (remaining_bindings, all_bindings, cons (cons (var_name, binding_value), accumulator));
	} else {
	    print_frame_helper (remaining_bindings, all_bindings, accumulator);
	}

    } else {
	accumulator;
    }

}

function print_frame (e) {
    let final_result = print_frame_helper (e, e, constant_nil ());
    final_result;
}

var db = constant_list (constant_list (constant_list (constant_symbol ("some"), constant_integer ("0"))), constant_list (constant_list (constant_symbol ("some"), constant_integer ("10"))), constant_list (constant_list (constant_symbol ("some"), constant_integer ("20"))), constant_list (constant_list (constant_symbol ("some"), constant_integer ("30"))), constant_list (constant_list (constant_symbol ("eq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("X")))), constant_list (constant_list (constant_symbol ("neq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_list (constant_symbol ("eq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_symbol ("!"), constant_symbol ("fail")), constant_list (constant_list (constant_symbol ("neq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y")))));

var goals = constant_list (constant_list (constant_symbol ("some"), constant_list (constant_string ("?"), constant_symbol ("X"))), constant_list (constant_symbol ("some"), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_list (constant_symbol ("neq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y"))), constant_list (constant_symbol ("eq"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("@"), constant_string ("add"), constant_list (constant_string ("?"), constant_symbol ("X")), constant_list (constant_string ("?"), constant_symbol ("Y")))));

function resolveArgs (a, bindings) {
    resolveArgsHelper (a, constant_nil (), bindings);
}

function resolveArgsHelper (args, accumulator, bindings) {
    if (isEmptyList (args)) {
	accumulator;
    } else {
	resolveArgsHelper (cdr (args), append2 (accumulator, list (value (car (args), bindings))), bindings);
    }

}

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

