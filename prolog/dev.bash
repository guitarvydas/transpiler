#!/bin/bash
set -x
../ohmjs.js "VirtualComma" virtualcomma.ohm virtualcomma.js <prolog.scm >prolog.vc
m4 <emptylist.ohm.m4 >emptylist.ohm
m4 <emptylist.rwr.m4 >emptylist.rwr
../ohmjs.js "RWR" ../rwr.ohm ../rwr.sem.js <emptylist.rwr >emptylist.sem.js
../ohmjs.js "EmptyList" emptylist.ohm emptylist.sem.js <prolog.vc >prolog.emptylist

