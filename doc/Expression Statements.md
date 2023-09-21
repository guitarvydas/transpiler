![[Expression Statements.png]]
This is the most complicated component in this system.  

It uses 
- a grammar
- a rewrite specification
- support code.

These 3 pieces of code are fed - as text - into the "isRewrite" component.  The "isRewrite" component needs 2 more pieces of information
- the name of the grammar, as a string
- the source text to be rewritten.

The "isRewriter" component pattern matches and transforms (rewrites) the input source according to the specifications in the grammar and the rewrite specification.  The rewrite specification ruses several - very simple - functions to do its work.  These functions are supplied as JavaScript text on the "rwrsupport" port.

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

The rule "StatementOperationSexpr" looks like a no-op in this grammar.  It simply invokes the rule "OperationSexpr".  Yet, in the rewrite specification, this seemingly minor distinction makes a difference - is the Sexpr an Operation, or, is the Sexpr a StatementOperation?  When emitting JavaScript, only the latter gets a semi-colon suffix.  Here, I allow the parser to determine the control flow for me, allowing my rewrite code to contain fewer `if...then...else` (ad-hoc) conditionals.


![[doc/Code/exprstatements.ohm.m4|exprstatements.ohm.m4]]
## Rewrite

![[exprstatement.rwr.m4]]