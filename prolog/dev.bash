#!/bin/bash
set -x
../ohmjs.js "VirtualComma" virtualcomma.ohm virtualcomma.js <prolog.scm >prolog.vc
m4 <unquote.ohm.m4 >gen.unquote.ohm
m4 <unquote.rwr.m4 >gen.unquote.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.unquote.rwr >gen.unquote.sem.js
../ohmjs.js "Unquote" gen.unquote.ohm gen.unquote.sem.js <prolog.vc >prolog.unquote
../ohmjs.js "ScmListConstants" listconstants.ohm listconstants.js <prolog.unquote >prolog.lc



