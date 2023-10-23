
Ohm-JS improves on stock PEG technology by providing the concept of *Syntactic Rules*.  Stock PEG-like behaviour is called *Lexical Rules* in Ohm-JS.

Syntactic rules skip (delete) whitespace automatically.  This makes Syntactic rules significantly "more readable".

Most PEG libraries use only Lexical rules.  Ohm-JS allows for both kinds of rules.  In Ohm-JS, the topmost rule determines how spaces are treated, for example if you invoke a Lexical rule from a Lexical rule, spaces are retained, whereas if you invoke a Lexical rule from a Syntactic rule, spaces are skipped (due to the invocation of Syntactic rule before the invocation of the Lexical rule).

This behaviour causes a problem when non-comma-based languages are used.

JavaScript *is* comma-based:

`f(12, 34);` is parsed, using Syntactic rules (space-skipping), as `f(12,34);` which groks as a function with 2 arguments.  The function name is `f`.  The arguments are `12`, and, `34`, respectively.

The same parse is derived for JavaScript when Lexical rules are used.  The main difference is (human) readability - the Lexical rules need to deal explicitly with spaces.  These details detract from the readability of grammar rules.

Lisp, though, is *not* comma-based:

`(f 12 34)` is parsed, using Syntactic rules (space-skipping), as `(f1234)` which is parsed as a function with 0 arguments.  The function name becomes `f1234`.

On the other hand, `(f 12 34)` is parsed, using Lexical rules (non-space-skipping), as `(f 12 34)` which is parsed as a function with 2 arguments.  The function name is `f` and the arguments are `12`, and, `34`, respectively.

We would like to be able to use Syntactic grammar rules in as many places as possible, instead of being forced to use Lexical rules, because Syntactic rules are more "readable" and result in easier reasoning-about.  To accomplish this, we use a simple pre-pass written using only Lexical rules, to insert virtual commas into the text.  Virtual commas are denoted by the out-of-band Unicode character `"ₓ"`.

With such a pre-pass, the phrase `(f 12 34)` is parsed into `(fₓ12ₓ34ₓ)`.  Space-skipping does not skip `"ₓ"` characters, allowing the use of Syntactic rules for subsequent passes of the transpiler, downstream from the Lexical pre-pass.  Since only identifiers and integers are suffixed by virtual commas, spaces can be inserted into the text for human-readability during debugging, while allowing grammars to be written using Syntactic rules. 

Other workarounds are possible, for example playing with Ohm's notion of what a space is, but, this workaround - virtual spaces - was arbitrarily chosen and appears to be sufficient for this project.