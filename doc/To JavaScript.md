
The second main component of the transpiler is the code emitter.  In this case, we emit JavaScript code using the *To JavaScript* component.

The *To JavaScript* component consists of six sub-components.

The first two components convert the allowable lisp characters into characters that fit the JavaScript syntax.  For example, dash `–` becomes underscore `_`. Dash is a valid character in Lisp identifiers, but, is not a legal character in JavaScript identifiers.  JavaScript interprets dash to mean *subtraction*.

Certain Lisp symbols such as `var?` are converted into JavaScript-compatible symbols like `isVar`.

The third component expression statements, takes list syntax where everything, including if statements and Koch, conditional statements, and while statements, converts them into expressions in this componenticular case, the choice was made to store the value of the expressions in_0_1_2, etc. variables those are inserted into the code. The the final generic code is then turned into his review the final Junior area code is then rewritten on a list basis into mostly JavaScript and then there are macro processing for in this componenticular case won't be one macro is handled and that is the mutate macro, which turns the function call mutate into an equals assignment operator in JavaScript, and then there's clean up which just removes of various tiny character patterns that are worth dealing with in the grammar, such does,) JavaScript requires commas between arguments, except for the last argument, and the front and you're a duck and the list rewriter passes easier right if you don't have to deal with that edge case and we just clean it up in the end