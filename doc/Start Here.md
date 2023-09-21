[[Introduction]]

## Warm-up Grammar
[[ABC]]
## General
[[Syntactic vs Lexical Grammar Rules]]
## Top Level
[[Top Level]]
[[Front End]]
[[To JavaScript]]

## Front End
[[Insert Virtual Commas]]
[[Escape Whitespace]]
[[Unquote]]
[[Constants]]
## JavaScript Emitter
[[Character Rewrites]]
[[Symbol Rewrites]]
[[Expression Statements]]
[[List Rewrites]]
[[Macros]]
[[Cleanup]]
## Utilities
[[Rewriter]]
[[iRewriter]]
[[isRewriter]]
[[doc/Transpiler]]
[[Fake Pipe]]
[[M4]]


## Warts
[[Warts]]
## Warm-up ABC Tiny Language

[[ABC]]

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


