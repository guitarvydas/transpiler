[[docwiki/Introduction]]

[Introduction](docwiki/Introduction.md)
[Introduction](docwiki/Introduction.md)

[[docwiki/PROLOG Control in Six Slides]]
[[docwiki/Pretty Printing]]
[[docwiki/History]]
## YAGNI
[[docwiki/YAGNI]]
## Basics and Warm-up Grammar
[[docwiki/Basics]]
## General
[[docwiki/Syntactic vs Lexical Grammar Rules]]
# The Transpiler
## Top Level
[[docwiki/Top Level]]
[[docwiki/Front End]]
[[docwiki/To JavaScript]]

## Front End
[[docwiki/Insert Virtual Commas]]
[[docwiki/Escape Whitespace]]
[[docwiki/Unquote]]
[[docwiki/Constants]]
## JavaScript Emitter
[[docwiki/Overview of JavaScript Emitter]]
[[docwiki/Character Rewrites]]
[[docwiki/Symbol Rewrites]]
[[docwiki/Expression Statements]]
[[docwiki/List Rewrites]]
[[docwiki/Macros]]
[[docwiki/Cleanup]]
## Utilities
[[docwiki/Rewriter]]
[[docwiki/iRewriter]]
[[docwiki/isRewriter]]
[[docwiki/Transpiler]]
[[docwiki/Fake Pipe]]
[[docwiki/M4]]
## Lisp-Like Functions for JavaScript

Scheme uses various functions and concepts that are not included in basic JavaScript.

It is easy, though, to write these functions in JavaScript syntax and to include them in a support library for the generated code.

`support.js` is the support code for Scheme-like functions and data structures written in JavaScript syntax.

## RWR - Rewriter
## OhmJS Component and Ohmjs.js
[[docwiki/OhmJS]]

## rwr

## Warts
[[docwiki/Warts]]

## Future
[[docwiki/Future]]

## Basics, Grammars, Interpreters, Compilers
[[docwiki/ABC]]

## Front End 

### Grammars
#### Prolog in Scheme
```
Prolog {
  Program = Sexpr+
  Sexpr =
    | "(" Sexpr* ")" -- list
    | "'" Sexpr -- quoted
    | string -- string
    | number -- number
    | Symbol -- symbol

  separator = "(" | ")" | "'" | "," | "@" | "\x60" | ";" | " . "
  vcomma = "ₓ"
  Symbol = symchar+ vcomma?
  symchar = ~vcomma ~separator ~space any
  
  string = dq (~dq any)* dq
  dq = "\""
  number = digit+ vcomma?
  semiColonComment = ";" (~"\n" any)* "\n"
  space += semiColonComment
}
```

### Rewrite Specifications
#### Prolog in Scheme
```
  Program [Sexpr+] = ‛«Sexpr»’
  Sexpr_list [lp Sexpr+ rp] = ‛«lp»«Sexpr»«rp»’
  Sexpr_quoted [q Sexpr] = ‛«q»«Sexpr»’
  Sexpr_symbol [Symbol] = ‛«Symbol»’

  // separator [c] = ‛«c»’
  // vcomma [c] = ‛«c»’
  Symbol [symchar+ vcomma?] = ‛«symchar»«vcomma»’
  // symchar [c] = ‛«c»’
  
  string [dq1 cs* dq2] = ‛«dq1»«cs»«dq2»’
  number [ds+ vcomma?] = ‛«ds»«vcomma»’
  semiColonComment [ksemi cs* nl] = ‛’
```
## JavaScript Emitter 

### Code
#characterrewrites 
```
#!/usr/bin/env node
//'use strict'

const fs = require ('fs');

function characterRewrites(inputString) {
    var r = inputString
        .replace(/-/g,'_')
    ;
    return r;
}
      

var input = fs.readFileSync ('/dev/fd/0', 'UTF-8');
var output = characterRewrites (input);
console.log (output);
```
### Grammars
### Rewrite Specifications


