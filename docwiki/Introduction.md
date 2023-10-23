This is a demonstration of a complete project written in Drawware.

It is a compiler.

It compiles Scheme code to JavaScript code.

The result is a search engine library for JavaScript.

The search engine is inspired by PROLOG - see the section "PROLOG Control in Six Slides".

Specifically, this project transpiles Nils Holm's Scheme code for PROLOG into JavaScript.

This project, also, includes a second compiler - "RWR" - that translates a nano-DSL into JavaScript.  I use RWR in conjunction with Ohm-JS.  This project could have been done without the use of the nano-DSL, and was - see the "History" section - but, inventing the RWR SCN helped me to concentrate on the task-at-hand - transpiling Scheme to JavaScript - instead of worrying about details that could, instead, be written as boilerplate code.

A main principle used herein is YAGNI, i.e. do the least amount of work possible, and, cheat as much as possible.  To this end, I began with code known to work, i.e. Holm's Scheme code and transpiled the Scheme code into code compatible with another existing compiler - node.js and JavaScript.  There is no reason to do extra work when existing, debugged compilers for these languages are easily available.  Using these cheats, I managed to build this project in a matter of of a few days.  In fact, most of the time spent on this project was in writing this document - attempting to translate what I did into readable English in written form.  See the section "YAGNI".

If you're not already familiar with grammars written in BNF, or the differences between interpreters and compilers, I've included a compiler for another silly, do-nothing little language - "ABC" - that demonstrates some of the basics.


## Code Repositories
This transpiler uses `Ohm-JS` and `odin0d` and `draw.io`.  

The repo for the complete transpiler is at https://github.com/guitarvydas/transpiler.

`Draw.io` can be found at https://app.diagrams.net/ . You need `draw.io` to edit the diagrams, but, not to read the documentation.

Nils Holm's PROLOG written in Scheme is at http://www.t3x.org/bits/prolog-6-code.scm.html .  Nils' code, slightly modified, appears in the transpiler repo as `prolog/prolog.scm`.  You don't need another copy of Nils' code, since it is already included in the transpiler repo.

Ohm-JS, if the reader wishes to read the code and documentation, can be found at https://ohmjs.org/ . You don't need another copy of Ohm-JS, since it is suitably included in the transpiler code.
