#SRC=test.scm
SRC=scm6a.scm

all: dev

scheme:
	@echo 'the answer should be (((x . 30) (y . 0)) ((x . 20) (y . 0)) ((x . 10) (y . 0)))'
	mit-scheme --batch-mode <scm6a.scm

dev: 1.scm ${SRC}
	cat 1.scm

1.scm : unbq.js ${SRC}
	./unbq.js <${SRC} >1.scm

process:
	./pre.js <scm6a.scm >1.scm

	./post.js <??.scm >???.scm
