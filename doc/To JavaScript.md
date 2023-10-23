
The second main component of the transpiler is the code emitter.  In this case, we emit JavaScript code using the *To JavaScript* component.

The *To JavaScript* component consists of six sub-components.

The first two components convert the allowable lisp characters into characters that fit the JavaScript syntax.  For example, dash `–` becomes underscore `_`. Dash is a valid character in Lisp identifiers, but, is not a legal character in JavaScript identifiers.  JavaScript interprets dash to mean *subtraction*.

Certain Lisp symbols such as `var?` are converted into JavaScript-compatible symbols like `isVar`.

The third component deals with converting JavaScript code into *expression statements*

In Lisp, everything, including if statements, and, conditional statements, and, while statements are expressions, not control flow statements.

JavaScript, and most other 3GLs like Python and Rust, treat this kind of syntax as *statements*, not expressions.  Expressions always return values, whereas statements are side-effects.  Statements essentially have *void* return types.  There at least two ways to convert statements into expressions:
1. convert *statements* into *functions* that return values
2. capture the inner results of statements in variables that effectively preserve the value of expressions in each statement.

In this particular case, the choice was made to store the value of the expressions in variables named `_0`, `_1`, `_2`, etc. Each statement is rewritten to use value-capturing assignments.

We chose this route as it is more illustrative of what can be done with this rewriting technique.  We emphasize the difference between expression-based languages, like Lisp, and control-flow-syntax-based languages like Python, Odin, Haskell, Rust, etc. and make the difference visible.

This choice makes the data-flow visible and isolated.  It becomes possible to treat the value-capturing data flow in a separate manner. Chunking the task in this way makes it easier to explicitly *reason about* the data flow of statement values.  In the future, it will be possible to use rewriting techniques, such as Cordy's Orthogonal Code Generator and GCC's RTL (Fraser/Davidson) to locally optimize the code and data flows, and, to use DAG techniques like those in the *Dragon Book* to optimize global data flows.

The final generic code is then rewritten into simplistic JavaScript.  At this point, the JavaScript is fairly dumb, but, easier to automatically emit.  JavaScript *assignment* is emitted as function calls instead of using JavaScript's "`=`" assignment operator. 

Here, the emphasis is on automatically *emitting* code, no matter how dumb.  Cleaning up the code to use less-dumb operators supplied by the target language (JavaScript) consists of dealing with edge-cases.  These edge-cases can be isolated from the main body of the emitter and treated separately.

#macros
In this case, we chose to treat only one edge-case - the conversion of `(mutate ... ...)` function calls into JavaScript syntax like `... = ...`.  An easy way to treat this edge-case is to consider the `(mutate ... ...)` function call as a *macro* and to rewrite such macros with different code.  This macro expansion is done by the `macros` component.

#cleanup
At the very end of the chain there's the `Cleanup` component.  `Cleanup` simply removes various tiny character patterns that are not worth dealing with in the grammar, such as "`,)`". JavaScript requires commas between arguments, except for the last argument.  Treating the last argument specially is an edge-case.  It is easier to write the emitter when such edge-cases are deferred, and, simply cleaned up in the end.  Before `Cleanup`, all actual arguments to functions are terminated by commas.  Such commas, that terminate actual arguments are called *ACommas* in the code.  *ACommas* are denoted by out-of-band Unicode characters `†` which are cleaned up in the final pass. 

Such avoidance of edge-cases is used liberally throughout the transpiler.  It becomes simpler to *reason about* such edge-cases when each kind of edge-case-avoidance is denoted by unique out-of-band characters.  For example, commas in *formal parameter* lists, i.e. the list of arguments in function declarations, are distinct from commas in *actual argument* lists, i.e. the list of expressions passed to a function call.  *Formal parameter* commas are denoted by the `‡`character whereas `actual argument` commas are denoted by `†` characters.  This approach highlights the technique of using text-rewriting in *syntax-driven translation* and is similar to the use of Greek characters and other kinds of short-hand symbols in mathematical notation, e.g. `Ω`, `ϕ`, `⊥`, `∫`, etc.  In standard practice, a programmer might represent exactly the same information in the form of complicated data structures such as Trees and DAGs.  Expressing this information as text makes it possible to use text-rewriting techniques and "Laws" to manipulate the information.  On the other hand, text annotated in this manner is more difficult for human readers to understand, but, poses no difficulties for machines and compilers and transpilers.  Note that the Holy Grail of mathematical notation and of FP (Functional Programming) is to convert all information into normalized form, in most cases textual form.  

Note that not *all* normalizations are textual.  For example, Feynman developed *Feynman diagrams* to *reason about* certain physical principles in a way that more clearly expressed the ideas being investigated and explained.

I use the term SCN - Solution Centric Notation - to mean any notation that makes it easier to think about certain problems in certain ways.  Until recently, it was believed that it was difficult to build custom notations for programming.  This belief has resulted in the notion of GPLs - General Purpose Languages.  With the advent of PEG (Parsing Expression Grammars) technology, it has become much easier to create a broad range of nano-DSLs (SCNs) and transpilers.  Transpiling notations into existing programming language formats makes the task of inventing and implementing SCNs much easier.  SCN builders do not need to write full-blown compilers - they can rely on existing compilers to do the heavy lifting as long as the SCNs are converted into syntax that is compatible with existing compilers.  As a result, it is possible to invent and build SCNs in about one day.  It is now possible to use *many* custom nano-DSLs (SCNs) for each programming project, instead of using one-size-fits-all General Purpose programming Languages.  It is hoped that the transpiler described in this document demonstrates what can be done.  At present, it is customary to solve programming problems by building obfuscated SCNs encoded as data structures expressed in GPL notation.

This idea is espoused in by Alan Kay in https://www.youtube.com/watch?v=fhOHn9TClXY&t=859s where he says, at 31:50, "In a 'real' Computer Science, the best languages of an era should serve as 'assembly code" for the next generation of expression.