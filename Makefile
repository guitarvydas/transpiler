ODIN_FLAGS ?= -debug -o:none

all: dev

dev: runjsprolog

runjsprolog:
	rm -f transpiler
	odin run . $(ODIN_FLAGS) >out/gen.js
	cat prolog/support.js out/gen.js >out/pl.js
	node out/pl.js


# very basic usage of ohmjs to compiler ABC compiler and interpreter

abcc:
	./ohmjs.js "ABC" abc/abc.ohm abc/abc.sem.js <abc/abc.abc

abci:
	./ohmjs.js "ABC" abc/abc.ohm abc/abc.sem.interp.js <abc/abc.abc

