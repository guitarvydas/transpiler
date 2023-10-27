
I've included a warm-up for using Ohm-JS.

This is a tiny language called "ABC".

Feel free to skip over this section if you are already familiar with grammars and Ohm-JS.

I've converted the original rewrite syntax, called `glue`, into the newer `.rwr` syntax.  The syntaxes are very similar.  The newer RWR syntax replaces double-brackets and `@` symbols with syntax that is, hopefully, less obtuse.  The RWR syntax allows a single rewrite string to, also, appear *before* the `=` sign in the rewrite specification.  This extra feature - called *before* - sets up information before tree-walking of sub-nodes and does not directly affect the output result.  This extra feature is used in only one component in the drawware transpiler - *ExprStatements*.

The ABC language uses Ohm-JS and raw JavaScript "semantics" code.  In the transpiler project, I use a second SCN (nano-DSL) to generate JavaScript semantics from `.rwr` specifications.  The drawware components bolt Ohm-JS and RWR together in the iRewriter components (Rewriter, iRewriter, isRewriter are all variations on the same theme *[TODO: combine all 3 into one, or layer them better]*).  Since RWR is yet another use of Ohm-JS, the Rewrite components invoke Ohm-JS twice in a row.
## Usage

`make abcc` to build the ABC compiler.

`make abci` to run the ABC interpreter.

The original string of essays about this language are at:

https://guitarvydas.github.io/2021/09/15/ABC-Glue.html