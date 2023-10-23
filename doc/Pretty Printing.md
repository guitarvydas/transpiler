Another issue - pretty printing and formatting - is completely avoided in this project, since it is possible to use off-the-shelf pretty printers to reformat the emitted code.  

Only the bare minimum of formatting is performed in this project.  

In my case, I used the pretty printer that comes with the Emacs editor.  It was necessary to carefully insert newlines in the right places, but not much else, to get Emacs to format the emitted code into "more readable" form.

Furthermore, Ohm-JS makes it possible to ignore whitespace, so, no effort was made to format the intermediate code, except at the very last stages of code emission.


