
Front end consists of 4 components pipelined together.
![[docwiki/screenshots/front end.png]]
## Virtual Commas
The first component inserts virtual commas into the incoming text.

This allows us to use Ohm-JS.  We can use lexical grammars early in the process then switch to using the more convenient Syntactic grammar form of Ohm-JS.

The main difference between lexical and syntactic grammar forms is the presence of white space.  Most PEG parsers require explicit handling of all whitespace characters whereas the developers of Ohm-JS designed the Ohm language in a way that allows whitespace to be skipped.  Ohm-JS does not require specification of whitespace characters.  This make the grammar more readable.

Syntactic grammars easily handle languages like Javascript that require commas, but, syntactic grammars require more care when dealing with comma-less languages like Lisp and Scheme and Racket.  The main issue is that two words separated only by spaces are parsed as a single word.  Insertion of virtual commas - an out-of-band character chosen from the Unicode character space, alleviates the Syntactic grammar issue.  Inserting virtual commas essentially "tokenizes" words so that they can be easily recognized by later passes using only Syntactic grammars.

Virtual commas are deleted at the last moment by the cleanup component.

Ohm-JS's *syntactic grammars* are so convenient to use that this kind of workaround is easily justified.  Using *syntactic grammars* in most of the downstream components makes the overall design of the transpiler easier to incrementally understand.
## Escape Whitespace
The second component escapes white space in strings and character constants.

If a string contains white space, we turn it into HTML compatible URL escapes.

Most modern languages have libraries that can be used to decode escaped strings.

Escaping is required to work around Ohm-JS's space skipping, which deletes whitespace even in constructs such as character strings.
## Unquote
The third component gets rid of the Lisp short hand *quote* `'` and converts quotes back into function-call-like syntax.

The expanded, unquoted, text is more verbose and more difficult for humans to read, but, the machine - the transpiler - doesn't care and gladly works with quotes in function-call-like form.

In fact, normalizing all text into function-call-like syntax makes the text more amenable to automation and code generation.

For example, the `unquote` component converts the list "`'(a b c)`" into "`(quote (a b c))"

## Constants
The final component of the front end - Constants - handles list constants.

Most programming languages provide a syntax for writing low-level data as in-situ constants.  For example, C provides single-quote syntax for specifying character constants, like `'x'`.

Lisp is no exception.  One of the low-level data structures in Lisp, is the *list*.  Lists are often specified literally in the source code, for example `'(a b c)`.  In such cases the syntactic construct `(a b c)` is understood to be a hard-wired list containing three symbols.  The Lisp compiler figures out - from the syntax rules - which pieces of text represent literal constants.

The *Constants* component does this same kind of work and inserts clues into the text to make the work of downstream passes easier.

## Example
For example, we convert `'(a b c)` into `(quoteₓ (aₓ bₓ cₓ))`, then into `(quoteₓ (aₓ bₓ cₓ))`, and, then convert this into final form `(quoteₓ (constant-listₓ aₓ bₓ cₓ))`, where "`ₓ`" is the Unicode character representing virtual commas.  Note that the transpiler doesn't care if we leave spaces in the final form, or, if we delete all spaces.  Only human readers care about the whitespace.  Ohm-JS deletes the whitespaces and the transpiler code doesn't care, as long as virtual commas are inserted.

In fact, the internal representation of this example is `(quoteₓ(constant-listₓaₓbₓcₓ))`

To make the final output of the transpiler acceptable for human use, we run the output through a pretty-printer. Later passes of the transpiler insert newlines (whitespace) to help with pretty-printing and human readability.
