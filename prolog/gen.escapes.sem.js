{
text: function (c) {
_ruleEnter ("text");
c = c.rwr ().join ('');

_ruleExit ("text");
return `${c}`;
},
char_string: function (ldq,cs,rdq) {
_ruleEnter ("char_string");
ldq = ldq.rwr ();
cs = cs.rwr ().join ('');
rdq = rdq.rwr ();

_ruleExit ("char_string");
return `${ldq}${cs}${rdq}`;
},
char_comment: function (ksemi,cs,nl) {
_ruleEnter ("char_comment");
ksemi = ksemi.rwr ();
cs = cs.rwr ().join ('');
nl = nl.rwr ();

_ruleExit ("char_comment");
return `${ksemi}${cs}${nl}`;
},
char_any: function (c) {
_ruleEnter ("char_any");
c = c.rwr ();

_ruleExit ("char_any");
return `${c}`;
},
stringchar_space: function (c) {
_ruleEnter ("stringchar_space");
c = c.rwr ();

_ruleExit ("stringchar_space");
return `&nbsp;`;
},
stringchar_newline: function (c) {
_ruleEnter ("stringchar_newline");
c = c.rwr ();

_ruleExit ("stringchar_newline");
return `&#10;`;
},
stringchar_tab: function (c) {
_ruleEnter ("stringchar_tab");
c = c.rwr ();

_ruleExit ("stringchar_tab");
return `&#9;`;
},
stringchar_lt: function (c) {
_ruleEnter ("stringchar_lt");
c = c.rwr ();

_ruleExit ("stringchar_lt");
return `&lt;`;
},
stringchar_gt: function (c) {
_ruleEnter ("stringchar_gt");
c = c.rwr ();

_ruleExit ("stringchar_gt");
return `&gt;`;
},
stringchar_amp: function (c) {
_ruleEnter ("stringchar_amp");
c = c.rwr ();

_ruleExit ("stringchar_amp");
return `&amp;`;
},
stringchar_quot: function (c) {
_ruleEnter ("stringchar_quot");
c = c.rwr ();

_ruleExit ("stringchar_quot");
return `&quot;`;
},
stringchar_squote: function (c) {
_ruleEnter ("stringchar_squote");
c = c.rwr ();

_ruleExit ("stringchar_squote");
return `&39;`;
},

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

