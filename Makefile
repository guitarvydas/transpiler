ODIN_FLAGS ?= -debug -o:none

all: dev

transpiler: transpiler.drawio main.odin */*.odin
	rm -f transpiler
	odin run . $(ODIN_FLAGS)

dev:
	./ohmjs.js "TEST" test.ohm test.sem.js support.js <test.txt

devsimple:
	./ohmjs.js "TEST" test.ohm test.sem.js support.js <test.txt

