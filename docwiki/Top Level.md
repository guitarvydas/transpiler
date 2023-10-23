
![[docwiki/screenshots/top level.png]]
The top level of the transpiler consists of two main components. This top level diagram contains a third, which is inconsequential

The main components are 
1. *Front End* and 
2. *To JavaScript*.

## Front End

*Front End* turns the incoming text it into something more normalized, but leaves it in a fairly generic form, kind of like a lisp-like syntax 

## To JavaScript

*To JavaScript* takes the generic form and creates JavaScript-compatible code from it.


## Read Text File

The third, inconsequential component is a file reader.

This is mainly a convenience.  We can provide a filename and the file reader will read the file and create a string that is used internally.

Obviously, if the incoming file is too large, it will blow out memory.  In this case, this doesn't happen - the incoming file `prolog.scm` is well within the limits.  YAGNI.  We need to check that the file can be read, but we don't need to write more code to handle that problem.

In general, it is always desirable to chunk projects into smaller files that can be handled easily and quickly by the tools.  When this transpiler fails due to insufficient memory, it is a sign that the project needs to be chunked into smaller pieces.

We don't prohibit the use of large projects, but, suggest that they be broken up into smaller pieces.

In general, that is always the case, even when using text files in text editors.  When the text cannot be viewed in one eye-full, it is too large and too complicated.

This example - `prolog.scm` is quite large and cannot be understood all at once.  Hence, we have chopped the project up into layers using the *Rule of 7*.  Most diagrams contain 7 or fewer components, making incremental understanding of the larger project more manageable.

## Incremental Understanding of This Project

The rest of this document describes the main components of the project in small, easier-to-understand pieces.

The implementation of a transpiler is a fairly complicated issue and the reader needs to understand the little details if the reader expects to understand the full project.

It is possible, though, to understand the project only at the "50,000 Foot Level" without digging into all of the niggly details.

This documentation and implementation attempts to present the myriad of little details in digestible pieces in a layered manner, starting with an overview at the top level.  The reader can decide which portions are interesting and to dig further into the details.
