#!/bin/bash
set -x
../ohmjs.js "VirtualComma" virtualcomma.ohm virtualcomma.js <prolog.scm >prolog.vc
m4 <emptylist.ohm.m4 >gen.emptylist.ohm
m4 <emptylist.rwr.m4 >gen.emptylist.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <gen.emptylist.rwr >gen.emptylist.sem.js
../ohmjs.js "EmptyList" gen.emptylist.ohm gen.emptylist.sem.js <prolog.vc >prolog.emptylist

