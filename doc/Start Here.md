- [x] [[doc/Introduction]]
- [x] [[doc/PROLOG Control in Six Slides]]
- [x] [[doc/Pretty Printing]]
- [x] [[doc/History]]
## YAGNI
- [x] [[doc/YAGNI]]
## Basics and Warm-up Grammar
- [x] [[doc/Basics]]
## General
- [x] [[doc/Syntactic vs Lexical Grammar Rules]]
# The Transpiler
## Top Level
- [x] [[doc/Top Level]]
- [x] [[doc/Front End]]
- [x] [[doc/To JavaScript]]

## Front End
- [x] [[doc/Insert Virtual Commas]]
- [x] [[doc/Escape Whitespace]]
- [x] [[doc/Unquote]]
- [x] [[doc/Constants]]
## JavaScript Emitter
- [x] [[doc/Overview of JavaScript Emitter]]
- [x] [[doc/Character Rewrites]]
- [x] [[doc/Symbol Rewrites]]
- [x] [[doc/Expression Statements]]
- [x] [[doc/List Rewrites]]
- [x] [[doc/Macros]]
- [x] [[doc/Cleanup]]
## Utilities
- [x] [[doc/Rewriter]]
- [x] [[doc/iRewriter]]
- [x] [[doc/isRewriter]]
- [x] [[doc/Transpiler]]
- [x] [[doc/Fake Pipe]]
- [x] [[doc/M4]]
## Lisp-Like Functions for JavaScript

- [x] [Lisp-Like Functions for JavaScript](doc/Lisp-Like%20Functions%20for%20JavaScript.md)

## RWR - Rewriter

## OhmJS Component and Ohmjs.js
- [x] [[doc/OhmJS]]

## RWR - Rewriting
[[RWR]]

## Warts
- [ ] [[doc/Warts]]

## Future
- [ ] [[doc/Future]]

## Basics, Grammars, Interpreters, Compilers
- [ ] [[doc/ABC]]

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


