#!/bin/bash
set -x
../ohmjs.js "VirtualComma" virtualcomma.ohm virtualcomma.js <prolog.scm >prolog.vc

m4 <unquote.ohm.m4 >gen.unquote.ohm
m4 <unquote.rwr.m4 >gen.unquote.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.unquote.rwr >gen.unquote.sem.js
../ohmjs.js "Unquote" gen.unquote.ohm gen.unquote.sem.js <prolog.vc >prolog.unquote

m4 <constants.ohm.m4 >gen.constants.ohm
m4 <constants.rwr.m4 >gen.constants.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.constants.rwr >gen.constants.sem.js
../ohmjs.js "Constants" gen.constants.ohm gen.constants.sem.js <prolog.unquote >prolog.constants

# JS emitter
m4 <characterrwr.ohm.m4 >gen.characterrwr.ohm
m4 <characterrwr.rwr.m4 >gen.characterrwr.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.characterrwr.rwr >gen.characterrwr.sem.js
../ohmjs.js "CharacterRewrites" gen.characterrwr.ohm gen.characterrwr.sem.js <prolog.unquote >prolog.characterrwr



