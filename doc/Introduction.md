This is a transpiler that converts Scheme code to JavaScript code.

The transpiler works on a YAGNI[^yagni] basis.  This transpiler assumes that the input source code is valid and has been checked by some other compiler and this transpiler does the minimum amount of work to recognize and convert a single program.

Working on a per-project basis helps to make this kind of programming - which I call SCN[^SCN] - simpler and much quicker.  Instead of taking years to develop a language or a DSL, this approach makes it possible to build a nano-DSL (an SCN) in the matter of only a few hours or days.

The goal of this transpiler is to create a searching and pattern-matching library for JavaScript.  The most convenient syntax for exhaustive searching is that of PROLOG (and, other Relational Languages).  Conveniently, Nils Holm has open-sourced the code for a PROLOG implementation in the language Scheme.  This transpiler converts Holm's code into working JavaScript code.  The transpiler works like a compiler.  It works at "compile time" and produces JavaScript code that can be compiled and run by `node.js`.

## Code Repositories
This transpiler uses `Ohm-JS` and `odin0d` and `draw.io`.  

The repo for the complete transpiler is at https://github.com/guitarvydas/transpiler.

`Draw.io` can be found at https://app.diagrams.net/ . You need `draw.io` to edit the diagrams, but, not to read the documentation.

Nils Holm's PROLOG written in Scheme is at http://www.t3x.org/bits/prolog-6-code.scm.html .  Nils' code, slightly modified, appears in the transpiler repo as `prolog/prolog.scm`.  You don't need another copy of Nils' code, since it is already included in the transpiler repo.

Ohm-JS, if the reader wishes to read the code and documentation, can be found at https://ohmjs.org/ . You don't need another copy of Ohm-JS, since it is suitably included in the transpiler code.

[^yagni]: You Aren't Going to Need It.

[^SCN]: Solution Centric Notation.