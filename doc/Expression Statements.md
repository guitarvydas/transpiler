![[docwiki/screenshots/Expression Statements.png]]
This is the most complicated component in this system, due to the use of support code.  Support code is not needed in all other rewriter components in this system

The `Expression Statements` Component uses 
- a grammar
- a rewrite specification
- support code.

These 3 pieces of code are fed - as text - into the "isRewrite" component.  The "isRewrite" component needs 2 more pieces of information
- the name of the grammar, as a string
- the source text to be rewritten.

The "isRewriter" component pattern matches and transforms (rewrites) the input source according to the specifications in the grammar and the rewrite specification.  The rewrite specification uses several - very simple - functions to do its work.  These functions are supplied as JavaScript text on the "rwrsupport" port.

Once the input text has been rewritten, it is sent to the "output" port of the "isRewriter" component.

If an error occurs during pattern matching, an error message is sent to the "error" port, and, nothing is sent to the "output" port (nothing, not even the empty string).

If an error occurs during rewriting, an error message is sent to the "error" port of "isRewriter", and, nothing is sent to the "output" port.

I have used graphical opacity and line thickness to highlight the main path in the design.  The rest of the paths are elided by making them more transparent and thinner.  The diagram compiler doesn't "care" about such graphical attributes and skips over them.  The compiler only processes rectangles, text, arrows and rhombuses, regardless of their colour, opacity, thickness, etc. 

The decision of which colours to use, which paths are "more important", etc. is purely arbitrary and only used as an aid to the human reader(s) of the diagram.  The above diagram captures my intent at the time of creation within the limits and restrictions of the editing tool (`draw.io` in this case).  Other choices could have been made, but, this is what I settled on.

The component "isRewriter" is a specialized variation on the theme of a "Rewriter" component.  In this case, I prefixed the name with single characters to remind myself which variation I was using.  My convention was that of using "i" to remind myself that the component expects source code on the "input" (aka "stdin") port and "s" to remind myself that the component expects source code on the "rwrsupport" port.  In the future, the family of "Rewriter" components should be rewritten in a way that avoids copying/pasting of code ("DRY" - don't repeat yourself), but, such cleanup and optimization was not the primary goal of this design.  Cleanup and optimization can be done later, separately from the task of Design.  It should be noted that DRY can help during Design, but, wasn't deemed necessary, by me, at this point.  I remained focussed on the task at hand (Design - just getting the thing to work, "using duct tape and bandaids") and deferred all other issues to be addressed later.

I will attempt to explain the pattern-matching specification - the "grammar" - and the rewrite specification, below.
## Grammar

The ExprStatements grammar inherits from the super-class grammar "prolog/prolog.ohm.inc".

The ExprStatements grammar overrides the Program rule of the super-class using the `":="` operator.

The ExprStatements grammar redefines the "Sexpr" rule from the super-class by adding new rules to the front of the super-class version of "Sexpr" (`"+="`).

I decided to treat a Program as 2 main lumps of code:
1. A bunch of *Defines*
2. followed by a *MainBody*.

Info: In Ohm-JS, if a pattern match item is suffixed with the `*` operator, it means that pattern matcher will look for 0 or more occurrences of that pattern match item.

I decided to chop up the Sexpr rule into 3 parts, followed by a catch-all.  The parts are tried in order of appearance.  The pattern-matcher looks for a *DefineSexpr*, then a *ControlFloSexpr*, then an *OperationSexpr*, and, finally it just defaults to using the original definition of *Sexpr* found in the super-grammar `prolog.ohm.inc` (which just matches for basic Scheme sexprs).

I decided on this split, since I know (by trial and error during the Design of this thing), that I wanted to separate definitions from control flow statements from stock operations (aka function calls), since that would help during rewriting.  Each kind of thing would need to be rewritten in a different way when targeting a less-generic syntax, even though the generic syntax of the original Scheme code treated all of these things in a similar manner (syntactically, at least).  It is easy to figure out which thing is which by looking at the first word in the sexprs.  For example, all *define* sexprs begin with the pattern `(define ...)`, all control-flow sexprs begin with  revealing keywords like `if`, `cond` and `let` (this kind of pattern is called a "left handle" ; Ohm-JS can actually handle patterns without needing to rely on left handles, but, Scheme syntax was designed with left handles to make parsing Scheme using ad-hoc manual techniques easier)...

In Scheme and Lisp, *every* sexpr returns a value, even sexprs like `if` and `cond` and `let`.  In other languages, these things are "statements" and tend to result in no value.  In other languages, though, function calls return values.  In those other languages, it matters whether the function call is in a "statement" position or not.  If a function is in a "statement" position, it's value is ignored and discarded.  If a function appears as part of an expression, though, its return value is used.  

For example, in JavaScript, we might call a function in two different ways:
1. `f(x);`
2. `1 + f(x) + 2`.

In case (1), the value of `f(x)` is ignored, while in (2), the value is used.

Because of this, I needed to recognize how Scheme's expressions are being used - either as values in expressions, or, as non-valued statements.

I decided to create a rule for "statements".  After pattern-matching, the parser tells me what was found in what position.  Anything that is marked as a "statement" gets a semi-colon tacked onto it in the JavaScript emitter - i.e. it becomes a JS statement.  All other uses of sexprs are assumed to be valued-expressions.  I decided to chunk statement thingies into 4 categories - `defines`, `control-flow` thingies like `if`, `cond`, and, `let`, sexprs that are found in "statement" positions and low-level atoms found in "statement" positions.  All of those things parse out under the name "StatementSexpr".  I use that as a definitive clue the rewriter code.  My goal is to *never* use `if...then...else` in the rewriter code and to let the parser determine all of the conditional branching for me, before reaching the rewriter code. 

The grammar rule "DefineSexpr" matches `defines` and breaks them down into 2 kinds - function defines and variable defines.  I tag them using Ohm-JS `""--""` tags as `define` and `definvar` respectively.

I use an Ohm-JS feature - a parameterize rule.  In this case the parameterized rule is `sym` and it is meant to take one match as its parameter.  Ohm-JS allows for more variations on using parameterized rules, but I needed only one string-match parameter.  In this case the parameter is the single string `"define"`.  The `sym<...>` rule is used to match `"define"` plus an optional virtual comma.  The actual `sym<...>` rule is defined at the bottom of the grammar.  Under normal circumstances, I would have used a simple string match `"define"`, but, because I want to pattern match a comma-less language, I need to match optional virtual commas as the separator characters for delimiting keywords, and, hence, need to use the parameterized rule instead of a straight-forward string match.  There is more than one way to solve this actual problem, for example, I could have dropped `vcomma?` patterns directly into the patterns for `DefineSexpr` (and, further down, for `ControlFlowSexpr`, and, `RemainingCondClaues`), but, I chose this way of writing the patterns since I believe that the overall patterns are more clear written this way.  `vcomma?` is just a niggly detail and I didn't want to hard-wire it into the higher-level rules.  I could, alternatively, have written separate keyword rules for `define` and `cond` and `let` and `if` and `else`, but, I liked the `sym<...>` version better - it looks cleaner to my eyes.  The actual choices could be argued, but, I'm the Architect and the "buck stops here", i.e. I get to decide how to do it.  My only criterion is whether I can make you - the reader - *understand* what my intention was, regardless of what my intention actually was.  I made the choice, the reader doesn't get a say in what I decided - the reader only needs to *understand* what I meant.

The grammar rule "ControlFlowSexpr" matches the 3 control-flow sexprs `if`, `cond`, and, `let`.

A `cond` consists of the keyword `cond` followed by a bunch of clauses, all wrapped inside a pair of parentheses.

I use the name "operation" for all other sexprs.  In this case, operation sexprs look like: an open paren, a symbol, a bunch of args (each a sexpr), and, a closing paren.  Note that this doesn't cover *all* of the possibilities in generalized Scheme code, but, it covers enough to parse this particular program.  YAGNI - there is no point in spending time to buff the parsing rules, here.  We only need rules that are "good enough" for parsing the intended source program (Nils Holm's PROLOG in Scheme).  There are other more rigorous Scheme parsers, e.g. mit-scheme, which I used to vette the original code and to find syntax errors and semantic errors. I don't need to duplicate that (harder) work.  The job here isn't to grok *all* of Scheme, the job is to transpile Nils Holm's program into valid JavaScript.

For the record, I use the name "Operator" to denote the first item in a sexpr and the word "Operand" to denote the rest of the arguments.  They are all just Atoms, but, their position in the sexprs matters when rewriting.  Their position in the sexprs determines their meaning.  *Operators* come first, then *operands*.  For example `(f x y)` means `f(x,y)`, where `f` is the operator and the *operands* are `x` and `y`.

The rule "OperationSexpr" breaks *operations* into 2 major pieces - *operator* and *operands*.  There might be 0 or more *operands*, so I use Ohm-JS' `"*"` operator as a suffix for *operands* in the "OperationSexpr" rule.

The rule "StatementOperationSexpr" looks like a no-op in this grammar.  It simply invokes the rule "OperationSexpr".  Yet, in the rewrite specification, this seemingly minor distinction makes a difference - it answers the question: is the Sexpr an Operation, or, is the Sexpr a StatementOperation?  When emitting JavaScript, only the latter gets a semi-colon suffix.  Here, I allow the parser to determine the control flow for me, allowing my rewrite code to contain fewer `if...then...else` conditionals.  A goal is to stop using `if...then...else` completely.  `If...then...else` is too ad-hoc when mixed with variables, and, leads to spaghetti code.  Likewise `case` and `switch` in present forms.  Note that OOP boils down to `case-on-type`.  We need to collect up other use-cases of conditionals and give them unique syntaxes and to disallow over-generalization.  Note that a "grammar" is but a declarative specification of conditional code.

The rule *Binding* peels off variable-bindings one at a time, recursively.  This helps the `let` rule parse `let` statements.  A `let` statement consists of 2 main parts
1. the bindings (values for named variables)
2. the body of the code in which the bindings are in effect ("scoped").

In Scheme and Lisp syntax, the *bindings* appear as a single list of sub-lists, one sublist for each named variable. The *body* appears as one or more expressions that follow the list of bindings.  As with all Lisp syntax, this is "easy" to parse, there are 3 parseable bits:
1. the keyword `let`
2. a single list of bindings
3. the rest (the *body*).

Similarly `if...then...else` breaks down into 3+1 parts:
1. the keyword `if`
2. the test (a single *sexpr* - a single list)
3. the *then-part* (a single sexpr)
4. the *else-part* (a single sexpr).

If there is no *else-part*, then the *else-part* is "nothing", i.e. *nil*, ie. the empty list.  An `if...then` expression is actually a list of 4 items, with the last item being `". nil"`.  The pretty-printer displays the `". nil"` part as nothing, to aid in human-readability, i.e. `(if (...) (...) . nil)` is displayed as `(if (...) (...))`.

The *Body* rule parses Sexprs, one at a time recursively, and brands them as *"statements"*.  In Lisp (Scheme) these look like any other Sexpr, but, in a syntax-full language, like JavaScript, each statement is suffixed with a semi-colon "`;`" and the expression value is considered to be thrown away.

The rule *MainBody* displays another feature of Ohm-JS syntax - the use a description for the rule, enclosed in parenthesis appearing before the `=` sign.  Here, again, *MainBody* punts the parsing work to another rule, *Body*, and tags the result uniquely or use in the rewriting section.

A `cond` in Lisp (Scheme) consists of a bunch of clauses, and, optionally, one `else` clause.  The non-else clauses are simple lists containing lists of items, each a Sexpr.  The first item is a test expression and the rest of the items are Sexprs that are evaluated only if the test Sexpr evaluates to `true` (`#t` in Scheme, and, anything-that-isn't-nil in Lisp).  An `else` clause begins with the keyword `else` and the rest of the clause consists of Sexprs that are evaluated only if no preceding clause was fired.  In Lisp (Scheme) the clauses are tested in order of appearance.

The rule `CondClauses` parses one clause at a time, recursively.  If matches for 4 items - "`(`" and `CondTest`, and, `CondConsequent`, and, "`)`".  If those 4 items are found, it tries to recursively find more such matches using the pattern `RemainingCondClauses?`.

The rule `CondTest`  boils down being a Sexpr.  I gave is the name `CondTest` to explain the meaning of the Sexpr.  In this example, the more-meaningful name is not needed in the rewriter and serves only as documentation for human readers.

Likewise, the rule `CondConsequent` is the same the rule `Body`, with the name being documentation for human readers.  Note that, instead of copy/pasting the code, we write `CondConsequent` to refer to the rule `Body`.  The rule `Body` contains the actual match specification. The Sexpr rule is more generic, but, at a lower layer.  The `Cond...` rules provide documentation as for the meaning of the rules and let the paring engine decide on how to optimize away the redundancy.

The way in which this parser is written assumes that a `Cond` will always have a least one `non-else` clause and the that `else` clause always comes last.  This assumption is encoded in the rule `RemainingCondClauses`.  Note that `RemainingCondClauses` relies on ordering of the branches.  It tests first for an `else` clause and only invokes `CondClauses` when an `else` clause is not found.  

Note, also, that matching of `CondClauses` stops when no more clauses - `else` or `non-else` - can be found, by virtue of the recursive, optional match of `RemainingCondClauses?`.  The parsing engine decides when it has hit the end of the `Cond` without our needing to give it a recipe on how to find the end of the `Cond`.  The backtracking action of the underlying PEG engine causes the matcher to *try* to find another clause, then give up and backtrack  when it doesn't find something suitable.  This kind of backtracking happens everywhere within the parser and *could* result in inefficiency, but, doesn't in the common case.  Since the point of this pattern-matcher is to help developers, we don't need to worry about efficiency in the same way that we might when creating end-user code. Specifications - grammars and rewrite specifications - run "fast enough" for development as long as they remain relatively small, and, don't require a great deal of effort to make more efficient.  Development time and development turn-around are more important here than shaving a few micro-seconds off of the running time off of the tool.

Note that, also, the assumption about `else` begin last is not strictly true for a full-blown Scheme compiler, but, is "good enough" for this transpiler.  The incoming code - Nils Holm's PROLOG in Scheme - does not contain any `else` clauses that aren't in the last position.  It would be nice to have a rigorous Scheme grammar, but, it is not worth the effort to make the grammar for this tool more rigorous.  If a more rigorous grammar is available for "free", then it should be used, but, making this particular grammar more rigorous is only a secondary consideration and should not consume development effort when a more-rigorous grammar is not already available.  As mentioned earlier, we can rely on other Scheme compilers - like mit-scheme - to perform a rigorous analysis of the code.  Here, we are only interested in transpiling already-checked code from Scheme into JavaScript.

The rule `Formals` matches for a bunch of formal parameters by virtue of the `*` (0 or more) operator of Ohm-JS.

The rule `Formal` states that a formal argument must always be a single symbol.  In Lisp, at least, this is not always the case (a formal can be specified in a more detailed manner using a Sexpr).  This assumption, though, is "good enough" for building this transpiler.  The input source code - Nils Holm's PROLOG - always writes formals as symbols without resorting to more detailed descriptions.

The rules `LHS` and `RHS` are not actually used in this grammar.  They appear due to historical reasons, and, were not removed before this document was written.

Atoms are `strings`, `numbers` or `symbols`.  We use the rule `ControlFlowAtom` to document the textual position of particular Atoms.  The rule `ControlFlowAtom` is used by the rule `sStatementExpr`, described earlier, to help the rewriter differentiate between expressions and statement-level uses of atoms where their values are ignored.  This detail is not strictly necessary for this transpiler, but, it was easy to write and was included essentially "for free".

At the very end of the grammar, we see the parameterized rule for `sym<...>`.  `Sym<...>` pattern matches for whatever its parameter is (`s` in this case) followed by an optional virtual comma (`vcomma?`).  In this parser, the `sym<...>` rule is used only a straight-forward manner - the parameter is always a simple string match.  Ohm-JS allows for more interesting definitions and uses of parameterized rules.  We don't use such power in this code.  The reader is referred to the documentation for Ohm-JS to learn about other possibilities for parameterize rules.

![[doc/Code/exprstatements.ohm.m4|exprstatements.ohm.m4]]
## Rewrite

![[docwiki/Code/exprstatement.rwr.m4]]

The job of the rewriter is to create a single string which is a rewritten / reformatted version of the input source text.

As such, each rewriter rule returns *exactly* one string.  Ohm-JS provides more flexibility in what kinds of things can be returned, but, this use-case of *strings-only* is simple and useful and "powerful enough" for writing text-to-text transpilers.

The rewrite specification closely follows the grammar specification.  There must be one rewrite rule for every grammar rule and the parameters must match the *arity* of the corresponding rewrite rules.  Ohm-JS allows programmers to elide - skip - writing rewrite rules for grammar rules that have exactly one match expression with no iteration operators (`?/*/+`).  Such rules are effectively "pass-throughs" and are a nuisance to write, adding no new information to the specifications.  Likewise, the rewrite SCN (nano-DSL) does not require rules to be written for such simple cases.  This feature is used in a sporadic manner in this transpiler code - sometimes I wrote explicit rules to handle these simple cases, and, at other times I skipped writing such simple rules.

A rewrite rule consist of 3 main parts
1. the rule name
2. the parameters, enclosed in square brackets `[...]`
3. the rewrite string written in enclosing Unicode quotes `‛...’`.

The 3rd part is visually separated from (1) and (2) by an `=` sign.  It is possible to include a rewrite string between parts (2) and (3) - this is a nuanced feature (*before* clauses) and is discussed in more detail below.

As mentioned, the rule name must match *exactly* with the name of one grammar rule.  Case matters.

Parameters can be specified in 2 ways
1. a symbol, unadorned
2. a symbol suffixed with an Ohm-JS iteration operator `?/*/+`.

Operators and lack-of-operators in the parameter list must match exactly with the terms in the corresponding grammar rules.  At present, this isn't checked and the onus is on the programmer to get the correspondence correct.  In the future, such checks might be included in the rewrite compiler.  Aside: the reason for adorning parameters is that the rewrite compiler needs to emit different code for tree-walking the parameters based how what kinds of matches they represent (simple vs. iteration operator).

The rewrite string is enclosed in matching Unicode quotes `‛...’`.

The rewrite string can contain 2 kinds of items:
1. raw characters that are passed directly to the output
2. references to variable values, with variable names enclosed in matching Unicode brackets `«...»`.

At present, the evaluation brackets `«...»` can contain any valid JavaScript expression.  The rewrite compiler simply copies the contents of the brackets to the generated JavaScript code.   This feature is used in a few places throughout the rewrite code, namely for constructs such as `«_.statementvaluetop ()»` which calls JavaScript support code.  In the future, we might restrict the syntax of the contents of the evaluation brackets to allow only evaluation of variables and evaluation of support functions.  This is not done in this version of the rwr compiler and "anything goes".  The primary goal, at this point, is to provide utility to programmers, leaving rigour as a secondary goal only.  A large percentage of use-cases can be covered by this simple tooling, and, since specifications are kept deliberately small (about 1 page of code at most), finding errors is not an onerous and confusing task that requires rigour to expunge all possibilities of programming mistakes.  In the future, it would be a goal to develop this tool in full-blown rigor, and, to map such rigorous understanding into less-onerous-looking DX (Developer eXperience) tools.

The goal of `ExprStatements` is to rewrite the intermediate code to include variables for each expression.  The variables are used to return the ultimate value of a group of statements.  For straight Sexprs, each return value is the value of the Sexpr itself.  In the cases of branching control flow Sexprs, like `if` and `cond`, the return value must be returned by the last expression in each branch.  This is done by creating a fresh local variable (using `let`) and ensuring that each branch assigns its value.  The value of the fresh variable is assigned to the enclosing value variable and the fresh variable is discarded. The algorithm employs a "dumb" strategy, assigning and re-assigning the same variable for each statement.  The idea is simply to make the code work, and, to optimize later.  The RTL peephole strategy employed by *gcc* can easily remove runs of re-assignments.  For example a ""`_0 = ...`"" statement followed by another ""`_0 = ...`"" statement can be collapsed to assign to `_0` only once and to ignore all other values. This RTL strategy is based on a paper by Fraser/Davidson https://www.researchgate.net/publication/220404697_The_Design_and_Application_of_a_Retargetable_Peephole_Optimizer and is generalized by Cordy's OCG work https://books.google.ca/books?id=X0OaMQEACAAJ&dq=bibliogroup:%22University+of+Toronto+Computer+Systems+Research+Institute+Technical+Report+CSRI%22&hl=en&sa=X&ved=2ahUKEwig1Legm8bqAhWvlHIEHYzzBYEQ6AEwBHoECAEQAQs .

The ExprStatements rewriting specification inherits from `prolog/prolog.rwr.inc` by including the `prolog.rwr` file.  The ExprStatements rewriting specification overwrites some of the inherited rules.  Aside: using JavaScript as the base language makes this easy, since the JavaScript compiler allows a function to be defined multiple times with the same name, but, will use only the "most recent" version of the function (it will use the variant which appears furthest down in the `.js` file).  Similar to Lisp's REPL / live environment.  (Load ...) causes Lisp to load a file into the REPL and to overwrite previous definitions, if any.

We don't need to worry much about pretty-printing and formatting, as the output can be pretty-printed by various editors, like *emacs* in Lisp-mode.  In the end, we only need to put newlines in at the right places to help the pretty-printers. 

The rules `Program`, `Sexpr`, and `StatementSexpr` are essentially pass-throughs.  According to the rules of Ohm-JS, we donn't even need to specify rewrite rules for `Sexpr`, and, `StatementSexpr`, since they take only one argument each.  We wrote rules anyway, for clarity.  The rule `Program` needs to be specified because it has 2 parameters, but, it doesn't do much, it simply concatenates the results into one long string.

The most significant rewriting happens in the rules `DefineSexpr`, and, `ControFlowSexpr`.  Each of these rules rewrite differently depending on the patterns that are parsed.  `DeifneSexpr` is broken down into two branches - `DefineSexpr_define` and `DefineSexpr_definevar`.  `ControlFlowSexpr` is broken down into three branches `ControlFlowSexpr_cond`, `ControlFlowSexpr_let`, and, `ControlFlowSexpr_if`.

Rule `DefineSexpr_define` uses support functions to keep a stack of value names.  In this case, the names are "`_0`", "`_1`", and so on.  The variable name in effect is at the top of the stack.  For example, at the top level "`_0`" is in effect.  When an `if` statement is encountered at the top level, the name "`_1`" is pushed onto the stack and all branch values are assigned to that name.  At the end of the `if`, we assign the previous value from the topmost value, for example `_0 = _1`.  Obviously, this "dumb" strategy can be improved, optimizing some of the variables away, but, the optimization is deferred to later thinking. The rule `DefineSexpr_define` uses a *before* clause to reset the stack.  The stack is reset before any of the sub-trees of `DefineSexpr_define` are walked, allowing the sub-rules to use the variable name at the top of the stack when creating rewrite strings to be returned into the `DefineSexpr_define` rule.

Rule `DefineSexpr_definevar` is different from `DefineSexpr_define` in that it defines a variable and initializes it with a value.  Maybe the value will be the last value evaluated in the code.  Therefore the value needs to be saved and returned as the result of the code.  Most programming languages do not work this way, but, there is no reason not to support the possibility for it - it's easy to do and can be optimized away later if not needed. To allow for this,  `DefineSexpr_definevar` defines and initializes the named variable, then immediately assigns the variable to the current value variable in effect, i.e. "`_0`" since these definitions always occur at the top level.  Note that this technique could be employed to define variables inside non-top-level scopes, in the future.  In the rewrite string, `(defineₓ «name» «e»)` causes the variable *name* to be created and to be initialized to the value of *e*, whatever it is.  The next line in the rewrite string `(mutateₓ «_.statementvaluetop ()» «name»)` emits code for `(mutateₓ *v* *name*)` which assigns *name* to *v*.  *v* is created by calling the support routine `_.statementvaluetop ()` which returns a text string containing the top of the value-saving stack of variables.  The syntax, in this usage of the support code, is that of JavaScript.  `"_"` is a JavaScript object that contains values and functions (a "namespace").  The bit of code `_.statementvaluetop ()` causes JavaScript to look up the `statementvaluetop` thingie in the `"_"` object and then to call it like a function (it had better be a function, or you get a runtime error).  The bit of code is contained in evaluation brackets `«...»` which causes RWR to execute the insides of the brackets as if it were JavaScript.  In most cases, the evaluation brackets contain the names of JavaScript variables, but, in this case, the brackets contain something more (a function call to the support library, which must return a string (even the empty string))).

`ControlFlowSexpr_let` receives 7 parameters which are mostly noise and syntactic sugar, like `lp` (left parenthesis), `rp` (right parenthesis), etc.  Note that the names of parameters must be unique, so in cases like this, were two sets of parenthesis are matched, each paren must be given a unique name.  In this case we simply use `lp`, `lp2`, `rp`, and, `rp2` as unique names.  

We use `k` to represent matched constant strings (this is a convention, not a requirement).  In this case `k` always matches `"let"`.

The form of a `let` expression in Lisp/Scheme is `(let (...bindings...) ...rest...)`.  The first item in the list is the keyword `"let"`.  The second item in the list is the set of bindings `(...bindings...)`.  The `body` is the list of left-overs `(...rest...)`.  Getting a list of left-overs is easy in Lisp/Scheme - using the built-in *rest()* (formerly known as *CDR*) operation twice.

The interesting parameters for `ControlFlowSexpr_let` are `binding` and `body`.  In Lisp and Scheme, a `let` expression declares zero or more local variables and, usually, initializes them.  The Lisp/Scheme syntax is that each variable+initialization is a pair - a name plus an expression - and the whole bunch of these pairs are wrapped by one more set of parentheses.  The result is that a binding is a single, parenthesized list `((...) (...))`, where each `(...)` is a name-value pair `(name sexpr)`.  The `body` is also a single list of expressions, but, it doesn't need to be visually enclosed in a second set of parentheses, because just taking the *rest* of the *rest* of the whole `let` expression results in a list of the left-over bits of the `let` expression.  

The rewrite string for `let` recombines the two interesting parameters and ignores the noise parameters. `‛(letₓ («binding») «body»)’` causes the incoming `let` expression to be re-emitted as a new `let` expression with the values of `«binding»` and `«body»` being determined by the tree-walk of various sub-rules based on the results of the pattern matching.

`ControlFlowSexpr_if` is slightly more complicated - but, only slightly.  It first creates a new expression-capture variable and puts it onto the top of the name stack, then it emits the expression and statements in the `if`, then it assigns its newly-created variable to the variable that preceded it.

The pattern, in rough is:
```
(let ((_NN (undefinded)))
  (if text-expression then-stuff else-stuff)
  (assign _NN to _MM))
```

Where _MM is the previous expression-capture variable and _NN is the freshly-created expression-capture variable.

The actual rewrite string is:
`‛(let ((«_.statementvaluetop ()» (undefₓ)))(ifₓ «test» «thn» «els»)(mutateₓ «_.statementvalueprev ()» «_.statementvaluetop ()»))«_.statementvaluepop ()»’`

Here, two support functions are used:
- `_.statementvaluetop ()` returns the name of the most recent expression-capture variable, and,
- `_.statementvalueprev ()` returns the name of the previous expression-capture variable.

The stack is cleaned up afterwards by the call to a third support function `«_.statementvaluepop ()»`.

A new variable is created by the call `‛«_.statementvaluenew ()»’` which precedes the `"="` in the rewrite rule.  The rules of RWR are such that this call is made - and, a fresh variable is created and pushed onto the stack - before any of the sub-matches are tree-walked.  Hence, by the time the sub-match rewrite code is executed, the newly-created variable is at the top of the stack, allowing the sub-match rewrite code to return strings that contain the name of the new variable.  This is one of the cases where a *before* clause needs to be used in the RWR rewrite code.  In many cases, this is not needed.  In fact, a *before* clause is used only in the RWR code for `ExprStatements` and is not needed elsewhere in the transpiler.

Note that we use the name `mutateₓ` to represent the assignment operation.  The form is `(mutateₓ target source)` where *source* is an expression that returns a value and that value is assigned to *target*.

`ControlFlowSexpr_cond` is much like the rule for `if`, except that it has multiple test expressions and consequents (*then-clauses*).   

`ControlFlowSexpr_cond` 
1. creates a fresh variable, 
2. inserts the code from the sub-matches (`CondClauses`), and, 
3. finally, assigns the fresh variable to the previous variable.

The three steps appear in the rewrite string 
```
‛
(let ((«_.statementvaluetop ()» (undefₓ)))
(condₓ «clauses»)
(mutateₓ «_.statementvalueprev ()» «_.statementvaluetop ()»))«_.statementvaluepop ()»’.
```

In the end, the emitted *COND* looks like the input *COND* with an extra let-variable wrapped around it containing an extra `mutateₓ` operation.  As with the `if` rule, we use a *before clause* to create a fresh variable and to put it on the top of the name stack.

The rule `OperationSexpr` is basically a no-op.  The incoming Scheme code formats function calls to look like `(fn args...)`.  The same format is emitted by `OperationSexpr`.  The string returned by the rule `OperationSexpr` is used by other rules in the grammar and rwr.  Namely, `StatementOperationSexpr` includes the string returned by `OperationSexpr` in its rewriting code and `Body` uses that result.

The rule `StatementOperationSexpr`simply wraps a `mutateₓ` operation around the result returned by the `OperationSexpr` rule.  It assigns the expression value to the top expression-capture variable, which it retrieves by using `«_.statementvaluetop ()»`.

The rule `Binding` works mostly as already described above.  Instead of using the `*` match operator, we use optional recursion (named `recursive` and suffixed by `?`).  The use of recursion over `*` here is arbitrary, but, recursion is needed in other kinds of rewrites, so the technique is displayed here.

The rules `Test`, `Then`, and `Else` are just convenience renamings of the `OperationSexpr` rule.  It is the tool's responsibility to optimize this kind of usage away, not the programmers' responsibility.  The renamings help the understandibility of the code.  For example, we know that `Then` is the *then-part* of an *if* statement, whereas calling it an *OperationSexpr* would be more obtuse.

The rule `Body` peels off one sexpr then recurs.  The use of recursion here is important, since the body might contain *let* statements and conditional statements, and, further scoping.  The rules for these other statements parse and rewrite their sub-matches and return strings for inclusion in the `Body` rule.

The `MainBody` rule is a convenience renaming of the more general `Body` rule.  `MainBody` is used in only one place - the top level.  I've chosen to name it `MainBody` to remind the reader of how this rule is positioned.

The rule `CondClauses` peels off one conditional pair (test expression X expressions to execute if true) then recursively looks for more pairs.  I'm not sure that recursion is actually necessary here, but, it was easy.  Maybe I could have pattern matched using the `+` operator in this case, e.g. `CondClauses = CondClause+` where `CondClause = "(" CondTest CondConsequent ")"`...

The grammar rule `CondTest` is used to pattern match a sexpr as the first item in a cond clause pair, i.e. a simple sexpr.  The matching rwr rule for `CondTest` does nothing more than parrot whatever the sub-match returns.

Likewise, `CondConsequent` just parrots what `Body` returns, i.e. 1 or more statements.

The grammar rule for `RemainingCondClauses` matches for `else` or, recursively, for more `CondClauses`, in that order.  The rwr rule `RemainingCondClauses` returns `(elseₓ ...)` where `...` is the string returned by `Body`.  The rwr rule for the default branch `RemainingCondClauses_more` simply parrots the return from `CondClauses`.

The rwr rule `Formals` concatenates the return strings from a sequence (0 or more) of matches of `Formal`.  `Formal` simply parrots the return from a `sym` (a word with an optional virtual comma).

`Operator` and `Operand` are simply sexprs with different names.  The rwr rules simply parrot the strings from their sub-matches.

The rules `LHS` and `RHS` are no longer used - they are there due to historical reasons and were not deleted before this document was written.  Ohm-JS raises an error when there are no matching "semantics" functions for each rule in the grammar, so, these 2 unused rules were included.  In fact, Ohm-JS allows you to skip writing functions for grammar rules that have exactly one parameter (one sub-match).  It would have been OK to leave these two rules out of the rwr specification, but, again due to historical reasons, the rwr rules were written and left in place.

The rules `ControlFlowAtom_string`, `ControlFlowAtom_number`, and,`ControlFlowAtom_symbol`, deal with the possibility that atoms appear in *statement* positions (hence, named with the *ControlFlow...* prefix).  These rules simply wrap the the corresponding atom in assignments to the top expression-capture variable.

The rule `sym` is used to pattern match for a symbol / word which includes an optional virtual comma.  The rwr rule simply concatenates the two parameters and returns the result as a single string.

## exprstatementsupport.js
This file is an implementation of the name stack - called `statementvaluestack` - needed by the `ExprStatements` rwr specification.  The the code is in JavaScript *namespace* format.  The namespace is assigned to the variable `"_"` (`_` is a valid ID in JavaScript and, by convention, means that it is local).

One variable - the stack - and 5 accessor functions are defined.

The stack is named `statementvaluestack`.  Instead of actual names, we push integers onto the stack.  Whenever it is required to return a name, the name is created by concatenating the variable name `"_"` with the string version of the integer.  We don't need to go to great lengths to create random integers.  We can start with 0 and increment, since it is only required that names be unique within the same runtime code execution.  The names are not exported (say, by writing them to the file system), so there is never any possibility of conflict with names from another runtime execution.

The function `clearstatementvalue` resets the stack to an starting state with only one variable (`_0`) on the stack.

The function `statementvaluetop` returns a string which is the name of the most recently created expression-capture variable.

The function `statementvaluepop` removes the top name and returns the empty string.

The function `statementvalueprev` returns a string which is the name of the next most recently created expression-capture variable. (TOS+1)

The function `statementvaluenew` creates a new variable name and pushes it onto the stack.  This function returns the empty string.

`_ = {
    statementvaluestack: [0],
    clearstatementvalue: function () { ... },
    statementvaluetop: function () { ... },
    statementvaluepop: function () { ... },
    statementvalueprev: function () { ... },
    statementvaluenew: function () { ... },
},`

Generated names are always suffixed with virtual commas `ₓ`. This guarantees that the generated names will be parsed as whole id's by Ohm-JS' space-skipping rules.  In some cases, it is redundant to supply virtual commas, but, their inclusion does not hinder parsing. We favour correctness over optimization.
