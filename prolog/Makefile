#SRC=test.scm
#SRC=test2.scm
SRC=scm6a.scm

all: jsprolog

scheme:
	@echo 'the answer should be (((x . 30) (y . 0)) ((x . 20) (y . 0)) ((x . 10) (y . 0)))'
	mit-scheme --batch-mode <scm6a.scm

jsprolog:
	rm -f unbq.scm unbq.js scm.ohm.inc lc.scm
	make scm.ohm.inc
	make unbq.js
	./pre.js <${SRC} >pre.scm
	./unbq.js <pre.scm >unbq.scm
	../ohmjs.js "ScmListConstants" listconstants.ohm listconstants.js <unbq.scm >lc.scm
	../ohmjs.js "Scm2JS" scm2js.ohm scm2js.js <lc.scm >js0.scm
	./post.js <js0.scm >scm6a.js
	cat support.js scm6a.js > prolog.js
	node prolog.js

dev:
	rm -f unbq.scm unbq.js scm.ohm.inc lc.scm
	make scm.ohm.inc
	make unbq.js
	./unbq.js <${SRC} >unbq.scm
	../ohmjs.js "ScmListConstants" listconstants.ohm listconstants.js <unbq.scm >lc.scm
	../ohmjs.js "Scm2JS" scm2js.ohm scm2js.js <lc.scm >js.scm
	cp -f js.scm result
	cat result

unbq.js: front.js scm.ohm.inc unbq3.js
	cat front.js scm.ohm.inc unbq3.js >unbq.js
	chmod a+x unbq.js

scm.ohm.inc: scm.ohm 1 3
	cat 1 scm.ohm 3 >scm.ohm.inc

