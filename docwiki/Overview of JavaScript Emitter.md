## Overview of JavaScript Emitter

Transpiling the intermediate code ("RT" Recursive Text) to JavaScript is performed in 6 bite-sized steps.  These steps could be optimized - later - but, this isn't necessary in the first go-around.  In fact, conflating Optimization with Design interferes with Design and produces less-interesting work.

1. character rewrites
2. symbol rewrites
3. expression capture
4. list rewrites
5. macros
6. cleanup

### Character Rewrites
- simple rewriting of "-" to "`_`"

"-" is a legal character in Lisp and Scheme identifiers, while it is not a legal character in JavaScript identifiers.

"`_`" is a legal character in JavaScript identifiers, so we simply convert all "-"s to "`_`"s.

The conversion is done with a JavaScript program that uses REGEXPs.
### Symbol Rewrites
Certain whole symbols are converted from Scheme/Lisp syntax to JavaScript syntax.

For example "`#t`" is legal in Scheme and becomes "`true`" in JavaScript.

For a complete list of conversions, see the [[docwiki/Symbol Rewrites]] section.

### Expression Capture

In Scheme/Lisp, *every* expression, include `if...then...else` returns a value.  Scheme/Lisp is a *expression language*.

In JavaScript, as well as most other languages with syntax for control-flow, this is not true.  *Statements* are not *expressions* and do not result in values.

The ExprStatements pass creates variables that capture expression values and inserts these variables and appropriate assignments into the intermediate code.

For example simple expressions, like `2+3`, become `_0 = 2+3`, where `_0` represents legal JavaScript variables, and, by convention, JavaScript variables whose names begin with "`_`" are taken to be local-only.

For example, statements like
```
if x {
  y = 2+3;
} else {
  y = 4+5;
}
```

require more complicated expression captures and become
```
var _1;
if x {
  _1 = y = 2+3;
} else {
  _1 = y = 4+5;
}
_0 = _1;
```
### List Rewrites
Most of "the rest" of the conversion from intermediate code to JavaScript is done in this pass, deferring some simple fixups that are not being bothered with, like ensuring that the correct number of commas appear in parameter lists.

This pass inputs the intermediate code in RT (Recursive Text) format - very similar to Lisp/Scheme, without syntactic baubles like "`'`", and, outputs mostly-valid JavaScript code.

Some control-flow syntax, like assignment, is deferred to later passes, e.g. *Macros*.

After this pass is finished, assignments are written as function calls, e.g.

```
mutate (_0, 2+3);
```
### Macros
This pass is used to rewrite some function calls into JavaScript syntax.

For this P.O.C., we rewrite only one "function call".

For example,
```
mutate (_0, 2+3);
```

is rewritten as
```
_0 = 2+3;
```
### Cleanup
This pass removes intermediate Unicode baubles that were used in earlier passes and fixes up commas.

For example `f (a,b,c,)` is rewritten as `f (a,b,c)`.

Convenience Unicode baubles like ₓ, ‡, and, † are simply deleted.

This pass is simple enough that it could be written as a JavaScript program that uses REGEXPs.  No pattern matching recursion is required, so REGEXP is "good enough".


