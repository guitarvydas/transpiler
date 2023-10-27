The goal of RWR (ReWRite) is to create a DSL for writing *semantics* code for OhmJS.

The OhmJS tool uses a DSL for the grammar and uses raw JavaScript (a namespace) for the "semantics".  

## Overview of the Parse + Semantics
The grammar consists of a syntax that is similar to BNF.  The grammar specifies an AST (Abstract Syntax Tree) of all of the possibilities for pattern matching the input source. 

The grammar is accompanied by *semantics* code, written in raw JavaScript.

The accompanying semantics code needs to provide one JavaScript function for every rule in the grammar (see the OhmJS documentation for various conveniences provided by the OhmJS tool).  

A successful parse, using the grammar, results in a tree - a *CST* (concrete syntax tree).  The tree is walked using the standard JavaScript method calling conventions.  See the OhmJS documentation for details.  The tree-walk is driven by  the actual parse of the actual input source text - the CST.  

For example, if the AST specifies this nonsense pattern match:

```
Addition = Primary "+" Primary
Primary = Variable | Integer
Variable = letter alnum*
Integer = digit+
```

and the input is `x + 5`, the CST will something like:

![[Excalidraw/RWR 2023-10-21 19.30.05.excalidraw]]
and the tree walking control flow will be
1. Addition(...)
2. Primary(...)
3. Variable(...)
4. Primary(...)
5. Integer(...)

where (1) calls (2) and (4), and, (2) calls (3), and, (4) calls (5).

(5) returns some value to (4), and, (4) then returns some value to (1).

Likewise, (3) returns a value to (2) then (2) returns some value to (1).

The returned values are used by (1) to, then, return some value to the top level.

The values returned by the sub-functions can be *any* JavaScript value.

Each JavaScript *semantic function* accepts some parameters.  Each parameter to each *semantic function* is a CST data structure representing the matching item(s).  

For example, if your grammar has a rule:
```
Addition = primary "+" primary
```

then the corresponding *semantic function* must have exactly 3 parameters, e.g.

```
{
...
    Addition: function (primary1, plusLiteral, primary2) {
        ...
    }
}
```

The three parameters, `primary1` `plustLiteral` and `primary2` are bound to little sub-CSTs after the parser has parsed the grammar.  To get the *value* of each parameter, you must apply an operation to each parameter, like:
```
let vprimary1 = primary1.rwr()
let vplusLiteral = plusLiteral.rwr()
let vprimary2 = primary2.rwr()
```

The name of the operation is arbitrary, but, must be defined in the *semantics* code (see OhmJS documentation for more detail).  In this case, we assume that the operation is called `rwr`.

The data structures are valid JavaScript *objects*.  The data structure is understood by OhmJS.  Only OhmJS needs to understand the data structure. You don't need to know what the data structure means, you only need to pass it around like an opaque handle and/or invoke operations on it. The parser creates the CST data structures, and, sub-CSTs, by using the grammar and matching it against the input source text.

After a successful parse, OhmJS creates a CST, then calls the *semantics* function with the same name as the top rule in the CST, with parameters corresponding to the partial matches in the top rule.

For example, let's look at the `exprstatements` grammar.

The first rule is:
```
  Program := DefineSexpr* MainBody
```

There must exist a *semantics* function called `Program : function (a, b) { ... }`.  The names of the parameters are arbitrary.  I've used `a` and `b` here.  The first parameter `a` contains a CST corresponding to the match tree for `DefineSexpr*` and the second parameter `b` contains a match tree for `MainBody`.

The *semantics* function can do anything it wants, but, usually it walks the trees for `a` and `b` and uses the results from those tree-walks.  To walk a tree, the *semantics* function must call an operation, for example
```
let walkedA = a.rwr();
let walkedB = b.rwr();
```

In the rule for `Program`, the first match corresponds to zero or more matches of `DefineSexpr`.  The `*` operator in the grammar tells the match engine to try to match `DefineSexpr` zero or more times.  The result - `walkedA` - is an array `[...]` of results from each match of `DefineSexpr`.  When there are zero matches, the resulting array is empty `[]`.

On the other hand `b` represents the one-and-only match of `MainBody`.  In this case `walkedB` contains exactly one result and is not an array.

What are the results? *Anything*.  The *semantics* functions for `DefineSexpr` and `MainBody` do some work and return any valid JavaScript data.  In the case of RWR, we constrain what the results can be (they must be *strings* when using RWR - see below).

When each *semantic* function calls operators on each of its parameters, we end up getting a traditional tree-walk.

Note that *semantics* functions for grammar rules must know whether their parameters contain singular CSTs, like the CST for `MainBody`, or, *iteration* CSTs, like the CST for `DefineSexpr*` and act accordingly.  In the case of RWR, we know that *all* semantics functions return *strings*, hence, we know that *iteration* CSTs return arrays of *strings*, hence, we can collapse such arrays by simply using the JavaScript `.join(...)` function.  Based on this assumption, RWR can insert `.join`s automatically when generating code.  RWR wouldn't be able to do this, in general, if we didn't make the assumption that *all* semantics functions return *strings*.  

There might be other interesting ways to return results, e.g. using some sort of "result" object, but, I found that the *string* assumption is powerful enough and doesn't require more complication.

## Boiler-Plating

A technique in compiler-writing is to find opportunities for using boiler-plate code - eschew special cases, make all code "the same", normalize.  This technique makes it easier to emit code from a compiler, and, makes it easier to find opportunities for optimization using simple ideas like pattern-matching.  Emitting code from a compiler is difficult, finding normalizations takes one of the degrees of freedom away and makes the algorithms for emitting code slightly easier to manage and to invent.  One of the reasons that *gcc* was able to perform better than most compilers, and, most assembler programmers, was that *gcc* relies on this technique of normalization and boiler-plating, deferring optimization until later in the process.  *Gcc* uses an intermediate form called *RTL* invented by [Fraser-Davidson](https://www.researchgate.net/publication/220404697_The_Design_and_Application_of_a_Retargetable_Peephole_Optimizer). [Jim Cordy's thesis](- [https://books.google.ca/books?id=X0OaMQEACAAJ&dq=bibliogroup:%22University+of+Toronto+Computer+Systems+Research+Institute+Technical+Report+CSRI%22&hl=en&sa=X&ved=2ahUKEwig1Legm8bqAhWvlHIEHYzzBYEQ6AEwBHoECAEQAQs](https://books.google.ca/books?id=X0OaMQEACAAJ&dq=bibliogroup:%22University+of+Toronto+Computer+Systems+Research+Institute+Technical+Report+CSRI%22&hl=en&sa=X&ved=2ahUKEwig1Legm8bqAhWvlHIEHYzzBYEQ6AEwBHoECAEQAQs)) generalizes the technique of normalization.

Is there an opportunity for *normalization* and *boiler-plating* in RWR? If so, what is it?  

Compilers are source-to-source transpilers.  Compilers input textual source code for some programming language, then, emit textual source code for *assembler*.

Given this observation, we chose to make RWR work only with *strings*.  All inputs to RWR are in the form of *strings*.  All outputs from RWR are (modified) *strings*.  All sub-matches are *strings* after they have been walked (operated upon). All *semantic functions* in an RWR implementation return (single) *strings*

## Chicken and Egg
There was a "chicken and egg" problem when writing the RWR DSL in OhmJS for use with OhmJS.  At first, RWR was written in pure OhmJS plus JavaScript, as suggested by the stock OhmJS workflow.  At some later point, the RWR rewrite specification was fed to itself, generating the rwr.sem.js code seen below.

## Preserving Whitespace
The syntax specification of RWR says that the RHS (right hand side) of a rewrite rule can contain any raw, valid ASCII characters, including whitespace.

To allow for this, it was necessary to use Lexical rules to describe the RWR grammar.  In some places, like RuleLHS, we know that whitespace cannot matter and the rule uses the Syntactic form (the first letter of the rule name is capitalized), but, to preserve whitespace in general, we needed to ensure that the top-most rule was Lexical (the first letter of the rule name is lower-case).

Note that the Lexical rules contain explicit matches for whitespace - `spaces`.  This adds noise to the rules and makes them somewhat harder to read.  We had to do this to preserve whitespace, thus, we needed to be extra careful when writing the Lexical rules.

There are other ways to preserve whitespace, but, we chose this way of doing it.  In fact, this project - transpiler - uses a different trick (URL encoding whitespace), but, we didn't think of that trick at the time and used up brain power to work around the whitespace skipping features of OhmJS.

### Left-over Whitespace Matching In Syntactic Rules
The `RuleLHS` rule is Syntactic, but, it contains explicit whitespace matches (which, incidentally, never fire).

This wart is due to the historical evolution of this code.  The code was originally written using only Lexical rules, then, later changed and some of the left-over `spaces` matches remained.

These extra matches do no harm during the parse, but, they make the `RuleLHS` a bit messier and bit harder to read.

It would be possible to "clean up" the grammar by deleting all occurrences of `spaces`, but, this hasn't been done.
## Down and Up
Historically, at the time this code was written, we were using the name *down* for the *before* strings in the grammar using the name *up* for the *after* strings.

Since then, we've changed our minds about what these things are to be called, but, we haven't upgraded the grammar and the semantics to match the new naming scheme.

## rwr.ohm
```
RWR {
  top = spaces name spaces "{" spaces rule+ spaces "}" spaces more*
  more = name spaces "{" spaces rule* spaces "}" spaces
  rule = applySyntactic<RuleLHS> spaces "=" spaces rewriteString -- up
  RuleLHS = 
    | name "[" Param* "]" spaces downString spaces -- down
    | name "[" Param* "]" -- nodown
  rewriteString = "‛" char* "’" spaces
  downString = "‛" char* "’"
  char =
    | "«" nonBracketChar* "»" -- eval
    | "\\" "n" -- newline
    | "\\" any -- esc
    | ~"’" ~"]]" any     -- raw
  nonBracketChar = ~"»" ~"«"  ~"’" ~"]]" any
  name = nameFirst nameRest*
  nameFirst = "_" | letter
  nameRest = "_" | alnum
  Param =
    | name "+" -- plus
    | name "*" -- star
    | name "?" -- opt
    | name     -- flat
  comment = "//" (~"\n" any)* "\n"
  space += comment
}
```

### Rule-by-Rule Walkthrough

I'll try to explain, by osmosis, what's going on in the grammar...

`  top = spaces name spaces "{" spaces rule+ spaces "}" spaces more*`

This rule is the first rule.  It is the default rule.  The parser starts here.

The rule is defined as a lexical rule (its name is `top` instead of `Top`) which means that it does not perform automatic space-skipping.  This means that all whitespace matching needs to be explicitly accounted for.

`spaces` is the first pattern in the rule.  `spaces` is a builtin rule that comes with OhmJS.  It matches zero or more `space` characters.  Note that the name `space` is singular, not plural - it is different from the name `spaces`.  The singular version *must* match a single character.  The set of characters that are considered to be spaces are originally built into OhmJS, but can be extended by the programmer.  On the other hand, the plural rule `spaces` is defined to match zero or more `space` characters.  If there are *no* spaces, then the `space` rule fails, but, the `spaces` (plural) rule succeeds and returns a match of zero characters.

Rule failure is inherent to the way OhmJS (and PEG) parsing works.  The engine tries to match the first pattern in a rule [we haven't yet discussed how to specify rules as a set of branches, but, it's quite straight-forward].  If that match fails, the parser backtracks and tries again with the next rule.  Rule and branch ordering matters, unlike in CFGs [ignore this statement, if you don't already know what a CFG is].

After matching zero or more `space` characters, the parser moves on and invokes the lexical rule `name`.  The rule `name` matches a valid name in the input.  The rule is defined below.  If the rule `name` succeeds, the parser moves on and tries to match the third item.  Since no "iteration" operator is used (`?/*/+`), this rule `name` must succeed, or else, the parser deems that the whole rule `top` has failed.

If the rule `name` succeeds, the parser moves on and tries to match the third item.  The third item is, again, a match for `spaces`, i.e. zero or more `space` characters.  This always succeeds, since it can return a valid result of zero matches if there are no spaces at this point in the parse, due to the fact that `spaces` is defined with the `*` operator [we haven't seen the definition for `spaces` yet, just take my word for it].

The fourth item must match a literal left-brace character `"{"`.

The fifth item is `spaces` again, which always succeeds.

After that, the parser tried to match one or more (`+`) lexical rules called `rule`.  If it finds at least one match, it continues.  If it finds none, it fails.

Then, the parser tries for more `spaces` again.

Then, the parser *must* match a literal right-brace.

Then, the parser tries for more `spaces` again.

And, finally, the parser tries to match zero or more (`*`) rules called `more`.

If the parser reaches the end of the rule, it deems success and calls the *semantic* rule `top`.  It passes ten little CSTsas parameters to the *semantic* rule `top`. One little CST for each match item in the rule (count 'em - there's ten in all, including the matches for `spaces`).

Why did I write a second rule called `more`?  I'm not sure anymore - it's probably historical.  I could have simply called `top*` instead of `more*`.  I was flip-flopping between using syntactic and lexical rules and was concerned with things other than cleaning up the design.

Deleting a rule from the grammar also means deleting it from the *semantics*. I guess that this consideration caused me to avoid deleting the `more` rule and changing the definition of the `top` rule.  Maybe I'll do this when I do a cleanup...

`  more = name spaces "{" spaces rule* spaces "}" spaces`

The `more` rule captures the idea that more than one grammar can be used, hence, more than one set of rewrite rules need to be defined.

In OhmJS, more than one grammar is often used when a grammar inherits from another grammar.

In RWR, this distinction doesn't matter a lot, we need to define a rewrite for every grammar rule.  The `name` and braces are parsed, but, ignored in RWR (that's called *syntactic noise*) to make the rewrite specification look like the grammar(s) that it corresponds to.

As mentioned above, it is probably possible to delete the `more` rule and to use a recursive call to `top` instead, but, historically the grammar was written (evolved) this way and was left alone after it worked.

`  rule = applySyntactic<RuleLHS> spaces "=" spaces rewriteString -- up`

This rule - called `rule` - matches the LHS and the RHS of an RWR rule.

The idea of *before* rewrites - called *down* in this grammar - was added later.  I now see a bug in this version of the grammar.  This bug wasn't a bug until *before* strings were added, late in the game.  The bug is that `rule` calls a syntactic rule `RuleLHS` when, in fact, it should call a lexical rule `ruleLHS`.  The syntactic version of RuleLHS skips (deletes) all whitespace.  This space-skipping will alter the *before* string (called *downString*, below) and will delete all whitespace in the *before* string.  If the *before* string contains whitespace, it is intended to be there and should, in general, not be deleted.  That's the bug - space-skipping will change the *before* string.  The fix is to use lexical rules instead of syntactic rules all the way down to the rule `downString`.  We should be excruciatingly explicit about whitespace so that whitespace is not deleted from the *before* string.  This isn't a problem when no `downString` is specified.  This became a problem only when `RuleLHS` was extended with *before* strings (called *downStrings* at the time this grammar was written).

The *Escape Whitespace* idea would have worked here, but, I hadn't thought of it at the time I wrote this code.  Failing that, to fix this would require rewriting the RuleLHS syntactic grammar rule as a lexical rule, which implies that whitespace would have to be handled explicitly.  Such changes to the grammar would, also, affect the *semantics* code - the name of the rule would have to be changed and the arity (the number of parameters) would need to be changed to accommodate the changes in the grammar.
```
RuleLHS = 
    | name "[" Param* "]" spaces downString spaces -- down
    | name "[" Param* "]" -- nodown
```
The rule `RuleLHS` is written as two branches 
1. with *before* strings (historically called *downStrings* in this version of the grammar)
2. without *before* strings.

In practice, *before* strings are not used often, so `RuleLHS` will usually match the `nodown` case.

Note, as discussed above, that this rule contains a bug, due to the historical evolution of the code.  

Originally, *before* strings did not exist and `RuleLHS` was written as a syntactic rule.  Later, *before* strings were tacked on to the RWR concept and a new branch - including *before* strings was added. This new branch is tagged *"-- down"* in this version of the grammar.  The bug is in this new branch.  The fact that the rule is syntactic means that the *before* string will have whitespace stripped out of it.  Such stripping is incorrect, but, doesn't seem to affect all uses of this version of the RWR grammar.

```
  rewriteString = "‛" char* "’" spaces
```
The rule `rewriteString` is used to match ("parse") a rewrite string for *after* and *before* strings.

The pattern uses Unicode quotes to bracket a bunch of characters.  In some cases, the characters (`"«...»"`) are *eval*ed and replaced by their value, whereas in most other cases the characters are copied *verbatim* to the final string.  Some escapes are allowed.  See the rule `char` below.

```
  downString = "‛" char* "’"
```

The rule `downString` is like the previous rule `rewriteString`, but is tagged with a different name to help the *semantics* code differentiate the two kinds of strings by their position in the RWR specification.  *after* strings appear after the `"="` on the RHS while *before* strings appear before the `"="` in the RWR specification.

It is necessary to look at the *semantics* code for the functions `rewriteString(...)` and `downString(...)` to see the (subtle) differences in how the code is generated.

Using the parser to tag similar rules with different names, allows us to simplify writing *semantics* code and to avoid using `if...then...else` in the corresponding *semantic* code.  We have to use *state* when writing the *semantics* code, but, in this case, we factor out the *state* into the parser.  The parser figures out (by pattern matching) the required *state* information and passes it on to the *semantics* code.  The *semantics* code, hence, does not need to worry about tracking state - that is done by the parser before the *semantics* code is called.  
```
char =
    | "«" nonBracketChar* "»" -- eval
    | "\\" "n" -- newline
    | "\\" any -- esc
    | ~"’" ~"]]" any     -- raw
```

The rule `char` handles the parsing of characters in *after* and *before* strings.  It allows some escapes (`\n`, and `\` preceding any character) and matches bracketed *eval* items (`"«...»"`).  Any character that isn't a closing string bracket (`"’"` or `"]]"` - the `]]` syntax is matched for historical reasons) is accepted and copied "as is" to the final string.

See the *semantic* function `char_eval(...)` to see how *eval* items are handled.

```
  nonBracketChar = ~"»" ~"«"  ~"’" ~"]]" any
```

The rule `nonBracketChar` is used by the rule `char` above, to match for characters that can legally appear in a rewrite string.  This rule disallows *eval* brackets `"«...»"`.  This rule could have been written to handle recursive uses of *eval* brackets, but, wasn't written that way.

In OhmJS, the prefix operator `"~"` is a negative match.  It succeeds only when the next item is *not* matched.  In this case, we negative match for some literal characters, but, `"~"` can be applied to a wider range of patterns.

Note that the rule `char` tries the various branches in order, i.e. the parsers tries to match the `"-- eval"` branch first, if that fails, it tries to match the `"-- newline"` branch, then, the `"-- esc"` branch, and, finally the `"-- raw"` branch.  If the parser begins by seeing a `"«"` character, it tries to match for a name of a variable to be evaluated.  A name can contain anything except closing brackets - "»", "«", " ]]" -- and the string-closing quote `"’"`.  

Aside: historically, we tried to use ASCII brackets `"[[ ... ]]"` for *eval* variables (this syntax was inspired by Liquid), then, switched to using Unicode brackets `"« ... »"`.  

Aside: we could have written this rule differently, but, didn't.  For example, we could have created a rule that matched brackets - `"[[", "]]", "«", "»"` - and then included a negative match on that single rule in `nonBrackChar`.  We didn't do it this was for arbitrary reasons.

Aside: we wrote `... ~"»" ~"«"...` instead of the more obvious `... ~"«" ~"»" ...` as a sop to "efficiency".  We expect that most valid uses of *eval* variable names would not include the open bracket `"«"`, so we match for the close bracket `"»"` first to avoid extra checking.  In an ideal world, the OhmJS compiler would let us write the more obvious version, then produce optimized code to match for the pattern.  In this case, only the OhmJS programmer knows what might be expected and is expected to manually specify the more-efficient order.  I'm not sure how a compiler could determine this re-ordering optimization, except by using JIT techniques at runtime, maybe blended with AI-like "training".

Aside: note that the `nonBracketChar` does *not* disallow whitespace, or other strange characters, to be used in *eval* names.  In practice, this allows us to use JavaScript expressions inside the *eval* brackets during experimentation and early bootstrapping. In general, we note that the rules for naming variables were invented in the 1950s based on the ASCII alphabet.  In the background, we are also thinking about a skunk-worksian sub-project for experimenting with new ways to name variables.  To this end, there is no reason, yet, to restrict variable names in the usual way, and, the rule `nonBracketChar` is written that way.  Another line of thinking, supported by the wording of this rule, is the idea of mixing the use of various programming languages within the same script.  In this case, specifically, we have created a DSL that augments JavaScript, but, still allows JavaScript to be used in specific places.  This lets us cheat by allowing us to break out to previously-defined programming languages to handle work that we don't wish to re-invent.

```
  name = nameFirst nameRest*
```

The rule `name` encodes the customary matching for a variable name, i.e. a letter or underscore, followed by zero or more letters, digits, or underscores.

```
nameFirst = "_" | letter
```

The rule `nameFirst` is a helper for the rule `name`, above.  This rule matches for the first legal character of an identifier, i.e. an underscore or a letter. Note that OhmJS provides a builtin pattern for (only) letters, called `letter`.  This builtin matches, both, lower case and upper case letters.

```
nameRest = "_" | alnum
```
The rule `nameRest` is a helper for the rule `name`, above.  This rule matches for any legal follow-characters of an identifier, i.e. an underscore or a letter or a digit.  Note that OhmJS provides a builtin pattern for letters and/or digits, called `alnum`.


- [ ] 
```
  Param =
    | name "+" -- plus
    | name "*" -- star
    | name "?" -- opt
    | name     -- flat
```

- [ ] 
```
  comment = "//" (~"\n" any)* "\n"
```

- [ ] 
```
  space += comment
```

## rwr.sem.js
```
{
    top : function (_ws1,_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3,_more) { 
        _ruleEnter ("top");

        var ws1 = _ws1.rwr ();
        var name = _name.rwr ();
        var ws2 = _ws2.rwr ();
        var lb = _lb.rwr ();
        var ws4 = _ws4.rwr ();
        var rule = _rule.rwr ().join ('');
        var ws5 = _ws5.rwr ();
        var rb = _rb.rwr ();
        var ws3 = _ws3.rwr ();
        var more = _more.rwr ().join ('');
        var _result = `{
${rule}${more}
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
`; 
        _ruleExit ("top");
        return _result; 
    },

    more : function (_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3) { 
        _ruleEnter ("top");

        var name = _name.rwr ();
        var ws2 = _ws2.rwr ();
        var lb = _lb.rwr ();
        var ws4 = _ws4.rwr ();
        var rule = _rule.rwr ().join ('');
        var ws5 = _ws5.rwr ();
        var rb = _rb.rwr ();
        var ws3 = _ws3.rwr ();
        var _result = `
${rule}
`; 
        _ruleExit ("top");
        return _result; 
    },


    ////
    


    rule_up : function (_lhs,_ws1,_keq,_ws2,_rws) { 
        _ruleEnter ("rule_up");

        var lhs = _lhs.rwr ();
        var ws1 = _ws1.rwr ();
        var keq = _keq.rwr ();
        var ws2 = _ws2.rwr ();
        var rws = _rws.rwr ();
        var _result = `${lhs}
_ruleExit ("${getRuleName ()}");
return ${rws}
},
`; 
        _ruleExit ("rule_up");
        return _result; 
    },
    ////
    
    // RuleLHS [name lb @Params rb] = [[${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}${Params}
    // ]]
    RuleLHS_nodown : function (_name,_lb,_Params,_rb) { 
        _ruleEnter ("RuleLHS_nodown");

        var name = _name.rwr ();
        var lb = _lb.rwr ();
        var Params = _Params.rwr ().join ('');
        var rb = _rb.rwr ();
        var _result = `${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}${Params}
`; 
        _ruleExit ("RuleLHS_nodown");
        return _result; 
    },
    
    RuleLHS_down : function (_name,_lb,_Params,_rb, _ws1, _downstring, _ws2) { 
        _ruleEnter ("RuleLHS_down");

        var name = _name.rwr ();
        var lb = _lb.rwr ();
        var Params = _Params.rwr ().join ('');
        var rb = _rb.rwr ();
        var _result = `${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}\nvar _0 = ${_downstring.rwr ()};\n${Params}
`; 
        _ruleExit ("RuleLHS_down");
        return _result; 
    },

    ////


    // rewriteString [sb @cs se ws] = [[return \`${cs}\`;]]
    rewriteString : function (_sb,_cs,_se,_ws) { 
        _ruleEnter ("rewriteString");

        var sb = _sb.rwr ();
        var cs = _cs.rwr ().join ('');
        var se = _se.rwr ();
        var ws = _ws.rwr ();
        var _result = `\`${cs}\`;`; 
        _ruleExit ("rewriteString");
        return _result; 
    },

    downString : function (_sb,_cs,_se) { 
        _ruleEnter ("downString");

        var sb = _sb.rwr ();
        var cs = _cs.rwr ().join ('');
        var se = _se.rwr ();
        var _result = `\`${cs}\``; 
        _ruleExit ("downString");
        return _result; 
    },


    ////
    // char_eval [lb name rb] = [[\$\{${name}\}]]
    // char_raw [c] = [[${c}]]
    char_eval : function (_lb,_cs,_rb) { 
        _ruleEnter ("char_eval");

        var lb = _lb.rwr ();
        var name = _cs.rwr ().join ('');
        var rb = _rb.rwr ();
        var _result = `\$\{${name}\}`; 
        _ruleExit ("char_eval");
        return _result; 
    },
    
    char_newline : function (_slash, _c) { 
        _ruleEnter ("char_newline");

        var slash = _slash.rwr ();
        var c = _c.rwr ();
        var _result = `\n`; 
        _ruleExit ("char_newline");
        return _result; 
    },
    char_esc : function (_slash, _c) { 
        _ruleEnter ("char_esc");

        var slash = _slash.rwr ();
        var c = _c.rwr ();
        var _result = `${c}`; 
        _ruleExit ("char_esc");
        return _result; 
    },
    char_raw : function (_c) { 
        _ruleEnter ("char_raw");

        var c = _c.rwr ();
        var _result = `${c}`; 
        _ruleExit ("char_raw");
        return _result; 
    },
    ////
    
    // name [c @cs] = [[${c}${cs}]]
    // nameRest [c] = [[${c}]]

    name : function (_c,_cs) { 
        _ruleEnter ("name");

        var c = _c.rwr ();
        var cs = _cs.rwr ().join ('');
        var _result = `${c}${cs}`; 
        _ruleExit ("name");
        return _result; 
    },
    
    nameFirst : function (_c) { 
        _ruleEnter ("nameFirst");

        var c = _c.rwr ();
        var _result = `${c}`; 
        _ruleExit ("nameFirst");
        return _result; 
    },

    nameRest : function (_c) { 
        _ruleEnter ("nameRest");

        var c = _c.rwr ();
        var _result = `${c}`; 
        _ruleExit ("nameRest");
        return _result; 
    },

    ////


    // Param_plus [name k] = [[\nvar ${name} = _${name}.rwr ().join ('');]]
    // Param_star [name k] = [[\nvar ${name} = _${name}.rwr ().join ('');]]
    // Param_opt [name k] = [[\nvar ${name} = _${name}.rwr ().join ('');]]
    // Param_flat [name] = [[\nvar ${name} = _${name}.rwr ();]]


    Param_plus : function (_name,_k) { 
        _ruleEnter ("Param_plus");

        var name = _name.rwr ();
        var k = _k.rwr ();
        var _result = `\n${name} = ${name}.rwr ().join ('');`; 
        _ruleExit ("Param_plus");
        return _result; 
    },
    
    Param_star : function (_name,_k) { 
        _ruleEnter ("Param_star");

        var name = _name.rwr ();
        var k = _k.rwr ();
        var _result = `\n${name} = ${name}.rwr ().join ('');`; 
        _ruleExit ("Param_star");
        return _result; 
    },
    
    Param_opt : function (_name,_k) { 
        _ruleEnter ("Param_opt");

        var name = _name.rwr ();
        var k = _k.rwr ();
        var _result = `\n${name} = ${name}.rwr ().join ('');`; 
        _ruleExit ("Param_opt");
        return _result; 
    },
    
    Param_flat : function (_name) { 
        _ruleEnter ("Param_flat");

        var name = _name.rwr ();
        var _result = `\n${name} = ${name}.rwr ();`; 
        _ruleExit ("Param_flat");
        return _result; 
    },
    
    ////

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

```