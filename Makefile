ODIN_FLAGS ?= -debug -o:none

all: dev

dev: runjsprolog

runjsprolog:
	rm -f transpiler
	odin run . $(ODIN_FLAGS) >out.js
	cat prolog/support.js out.js >out1.js
	node out1.js


# very basic usage of ohmjs to compiler ABC compiler and interpreter

abcc:
	./ohmjs.js "ABC" abc/abc.ohm abc/abc.sem.js <abc/abc.abc

abci:
	./ohmjs.js "ABC" abc/abc.ohm abc/abc.sem.interp.js <abc/abc.abc

