
The transpiler works on a YAGNI[^yagni] basis.  This transpiler assumes that the input source code is valid and has been checked by some other compiler and this transpiler does the minimum amount of work to recognize and convert a single program.

Working on a per-project basis helps to make this kind of programming - which I call SCN[^SCN] - simpler and much quicker.  Instead of taking years to develop a language or a DSL, this approach makes it possible to build a nano-DSL (an SCN) in the matter of only a few hours or days.


[^yagni]: You Aren't Going to Need It.

[^SCN]: Solution Centric Notation.