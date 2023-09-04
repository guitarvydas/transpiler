ODIN_FLAGS ?= -debug -o:none

all: dev

transpiler: transpiler.drawio main.odin */*.odin
	rm -f transpiler
	odin run . $(ODIN_FLAGS)

dev:
	./ohmjs.js "RWR" rwr.ohm rwr.rwr <rwr.txt

devsimple:
	./ohmjs.js "TEST" test.ohm test.sem.js <test.txt

