Transpiling Nils Holm's Scheme code to JavaScript was my first project as I learned to use Ohm-JS.

A diary of that effort is [Ohm In Small Steps](https://guitarvydas.github.io/2020/12/09/OhmInSmallSteps.html).

In that version of the code, I wrote the grammar(s) in Ohm-JS and the accompanying "semantics" code in JavaScript.

Since then, I invented a nano-DSL that generates "semantics" code in JavaScript, reducing my coding effort when writing transpilers.

In the "Ohm In Small Steps" project, I chose to emit JavaScript code that relied heavily on JavaScript functions and closures.

In this next project, I chose to emit JavaScript code that looks more like traditional JavaScript code.  I hope that this choice makes the process easier to read and understand.  I extended my development time by a couple of days to emit nicer-looking JavaScript code.  Ultimately, there is no need for this extra step - the output of this transpiler does not need to be read by other people, it only needs to to be compiled by a JavaScript compiler.  An analogy is that in the early days of compiler-building, compilers emitted assembler in human-readable text form, so that other people could inspect the output.  Today, just about no one looks at the assembler output of compilers, and, therefore, compilers tend to emit binary instead of text.  Likewise, this transpiler could emit "unreadable" JavaScript code, as long as the emitted code is legal and can be compiled by existing JavaScript compilers.  Generating "unreadable", but legal, JavaScript code is easier and quicker, but, I chose to emit code the harder way in this project.

