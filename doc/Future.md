## OhmJS Takes Redirected Input 
We want to create a component that is equivalent to OhmJS, but, that takes input from file descriptors (like `stdin` except mapped to other FDs like 3,4,5,...) instead of needing input from files.  This would allow us to get rid of the fake pipes and to use real pipes.

## Replace Virtual Commas With Tokenizer
A more general technique than using Virtual Commas would be to tokenize just about everything, with unicode brackets like `❲...❳`.  See `loop-syntax/rt/word.*`

## Transpile to RT First
All code should be transpiled to RT (Recursive Text - almost like Lisp and Scheme, without the syntactic baubles), then, this would be transpiled to JavaScript/whatever.