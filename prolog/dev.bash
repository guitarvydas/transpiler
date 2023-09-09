#!/bin/bash
set -x
../ohmjs.js "VirtualComma" virtualcomma.ohm virtualcomma.js <prolog.scm >gen.prolog.vc

m4 <unquote.ohm.m4 >gen.unquote.ohm
m4 <unquote.rwr.m4 >gen.unquote.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.unquote.rwr >gen.unquote.sem.js
../ohmjs.js "Unquote" gen.unquote.ohm gen.unquote.sem.js <gen.prolog.vc >gen.prolog.unquote

m4 <constants.ohm.m4 >gen.constants.ohm
m4 <constants.rwr.m4 >gen.constants.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.constants.rwr >gen.constants.sem.js
../ohmjs.js "Constants" gen.constants.ohm gen.constants.sem.js <gen.prolog.unquote >gen.prolog.constants

# JS emitter
./characterrewrites.js <gen.prolog.constants >gen.prolog.characterrewrites.js

m4 <symrewrites.ohm.m4 >gen.symrewrites.ohm
m4 <symrewrites.rwr.m4 >gen.symrewrites.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.symrewrites.rwr >gen.symrewrites.sem.js
../ohmjs.js "SymRewrites" gen.symrewrites.ohm gen.symrewrites.sem.js <gen.prolog.characterrewrites.js >gen.prolog.symrewrites.js
echo 'output in gen.prolog.symrewrites.js'


