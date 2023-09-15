ODIN_FLAGS ?= -debug -o:none

all: dev

# transpiler: transpiler.drawio main.odin */*.odin
# 	rm -f transpiler
# 	odin run . $(ODIN_FLAGS)

abcc:
	./ohmjs.js "ABC" abc/abc.ohm abc/abc.sem.js <abc/abc.abc

abci:
	./ohmjs.js "ABC" abc/abc.ohm abc/abc.sem.interp.js <abc/abc.abc

dev:
	rm -f transpiler
	odin run . $(ODIN_FLAGS)

devsimple:
	./ohmjs.js "TEST" test.ohm test.sem.js  <test.txt

