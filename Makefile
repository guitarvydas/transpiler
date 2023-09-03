ODIN_FLAGS ?= -debug -o:none

all: transpiler

transpiler: *.odin */*.odin
	rm -f transpiler
	odin run . $(ODIN_FLAGS)

