#!/bin/bash
#SRC=test.scm
SRC=prolog.scm

../ohmjs.js "VirtualComma" virtualcomma.ohm virtualcomma.js <${SRC} >gen.prolog.vc
cp gen.prolog.vc out.txt

../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <escapes.rwr >gen.escapes.sem.js
../ohmjs.js "Escapes" escapes.ohm gen.escapes.sem.js <out.txt >gen.escapes.txt
cp gen.escapes.txt out.txt

m4 <unquote.ohm.m4 >gen.unquote.ohm
m4 <unquote.rwr.m4 >gen.unquote.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.unquote.rwr >gen.unquote.sem.js
../ohmjs.js "Unquote" gen.unquote.ohm gen.unquote.sem.js <out.txt >gen.prolog.unquote

m4 <constants.ohm.m4 >gen.constants.ohm
m4 <constants.rwr.m4 >gen.constants.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.constants.rwr >gen.constants.sem.js
../ohmjs.js "Constants" gen.constants.ohm gen.constants.sem.js <gen.prolog.unquote >gen.prolog.constants


###
# JS emitter
###

# character rewrites
./characterrewrites.js <gen.prolog.constants >gen.prolog.characterrewrites.js

# symbol rewrites
m4 <symrewrites.ohm.m4 >gen.symrewrites.ohm
m4 <symrewrites.rwr.m4 >gen.symrewrites.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.symrewrites.rwr >gen.symrewrites.sem.js
../ohmjs.js "SymRewrites" gen.symrewrites.ohm gen.symrewrites.sem.js <gen.prolog.characterrewrites.js >gen.prolog.symrewrites.js

# list rewrites
m4 <listrewrites.ohm.m4 >gen.listrewrites.ohm
m4 <listrewrites.rwr.m4 >gen.listrewrites.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.listrewrites.rwr >gen.listrewrites.sem.js
../ohmjs.js "ListRewrites" gen.listrewrites.ohm gen.listrewrites.sem.js <gen.prolog.symrewrites.js >gen.prolog.listrewrites.js
cp gen.prolog.listrewrites.js out.js

./cleanup.js <out.js >gen.prolog.js
cp gen.prolog.js out.js

m4 <retval.ohm.m4 >gen.retval.ohm
m4 <retval.rwr.m4 >gen.retval.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.retval.rwr | cat semsupport.js - >gen.retval.sem.js
../ohmjs.js "JSRetVal" gen.retval.ohm gen.retval.sem.js <out.js >gen.retval.js
cp gen.retval.js out.js

echo 'output in out.js'

# m4 <macro.ohm.m4 >gen.macro.ohm
# m4 <macro.rwr.m4 >gen.macro.rwr
# ../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.macro.rwr | cat semsupport.js - >gen.macro.sem.js
# ../ohmjs.js "JSMacro" gen.macro.ohm gen.macro.sem.js <out.js >gen.macro.js
# cp gen.macro.js out.js
# echo 'output in out.js'

#cat support.js out.js >prolog.js

#echo 'output in prolog.js'

