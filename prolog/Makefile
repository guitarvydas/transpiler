SRC=test.scm
#SRC=scm6a.scm

all: dev

scheme:
	@echo 'the answer should be (((x . 30) (y . 0)) ((x . 20) (y . 0)) ((x . 10) (y . 0)))'
	mit-scheme --batch-mode <scm6a.scm

dev:
	rm -f unbq.scm unbq.js scm.ohm.inc
	make unbq.scm
	cat unbq.scm

unbq.scm : unbq.js ${SRC}
	./unbq.js <${SRC} >unbq.scm

unbq.js: front.js scm.ohm.inc unbq3.js
	cat front.js scm.ohm.inc unbq3.js >unbq.js
	chmod a+x unbq.js

scm.ohm.inc: scm.ohm 1 3
	cat 1 scm.ohm 3 >scm.ohm.inc

process:
	./pre.js <scm6a.scm >1.scm

	./post.js <??.scm >???.scm
