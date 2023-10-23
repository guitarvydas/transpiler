![[docwiki/screenshots/listrewrites.png]]

The job of the `List Rewrites` component is to convert various sexprs into code that is closer to JavaScript

| input           |      output      |
|-----------------|------------------|
|(eqv? *e1* *e2*)|*e1* === *e2*|
|(string= *e1* *e2*) | *e1* == *e2* |
|(eq? *e1* *e2*)| _e1_ === _e2_|
|(+ *e1* *e2*)|_e1_ + _e2_ |
|(and *e1* *e2*)| _e1_ && _e2_|
|(or *e1* *e2*)| _e1_ \|\|  _e2_|
|(not *e*)| !*e*|
|(cond ((*e* *b*)... (else *b2*))|if (*e*) { *b* } else if (*e...*) { *b...* } else { *b2* }|
|(let *bindings* *body*)| |
|(if *e* *then* *else*)| |
|(define (*sym* *formals*) *body*)| |
|(define *sym* *e*)| |
|(*operator* *operands*)| |



