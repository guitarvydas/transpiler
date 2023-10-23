#rewriter
The goal of the `Rewriter` family of Components is to rewrite incoming text using a *grammar* and a *rewrite specification*.  This is done by using the `Transpiler` twice:
1. to transpile the *rewrite specification* from .rwr format into .js format
2. to transpile the source code - arriving on port *input* (called *stdin* in Unix) - by parsing it with the given grammar, then applying the rewrite rules to the parse.

This Component - `Rewriter` - was, historically, the template for `iRewriter` and `isRewriter`.

This Component - `Rewriter` - is not used in this version of the transpiler.

see [iRewriter](doc/iRewriter.md)

see [isRewriter](doc/isRewriter.md)

![](doc/screenshots/Rewriter.png)

- [ ] TODO: The other two Components `iRewriter` and `isRewriter` are but copy/paste variations of this template `Rewriter` component.  Cleaning up this system for production - which hasn't happened yet - would require applying DRY (Don't Repeat Yourself) principles to this group of components and melding them all into a single Component (possibly layered in various containers).  Note that this should be simple, since they all share the basic need - a *rewriter* that accepts source strings as inputs instead of filenames (by convention, ports that accept filenames are named with the suffix "fn").  In this version, the prefix "i" is used to signify a version of Rewriter that has source string ports and the prefix "s" is used to signify a version of Rewriter that, also, accepts source on its *stdin* port.  Copy/paste variations arose in this version of the transpiler due to the fact that the code was originally written in textual form that used filenames then crossed the chasm into diagrammatic form that required source data.  In general, there is no need for a copy/paste strategy when designing in the diagrammatic domain.  This wart of using filenames and source arises because we are straddling two domains - textual and diagrammatic.  Historically, we used this component before we invented the fake pipename strategy.  Probably, the solution to this duality dilemma would be to build a generic filename-to-source Component and to use it in the clean up.  See the `Transpiler` Component for a possible way to overcome this kind of wart.