![[doc/screenshots/Transpiler.png]]

This Component inputs
1. the grammar name (*grammar name*)
2. the grammar (*grammar* or *grammarfn* - actual grammar or its filename (*fn*))
3. the rewrite specification (aka "semantics") (*semantics* or *semanticsfn* - semantics as JavaScript namespace source or a filename)
4. source text to be rewritten (*input*).

The `transpiler` Component guarantees that the grammar name, the grammar itself and the rewrite namespace are sent to the `OhmJS` Component before the input is sent.  This is guaranteed by the `All Before 4` component.  This guarantee is required because the `OhmJS` component is a piece of traditional textual code.

The `transpiler` component is used by the `Rewriter` Component(s).  For actual rewriting, `transpiler` is used twice (see #rewrite)
1. to transpile the rewrite spec (*.rwr*) into a JavaScript namespace as textual source code
2. to parse and transpile the input source, using a given grammar and a given rewrite spec