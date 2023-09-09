// vcomma = "○￮￮₊ₓ˚

vcomma = "ₓ",

{
    input : function (cs) { return cs.rwr ().join(''); },
    char_space: function (c) { return c.rwr () },
    char_separator: function (c) { return c.rwr (); },
    char_needsVcomma: function (c, lookahead) { return c.rwr () + vcomma; },
    char_needsVcommaSeparator: function (c, lookahead) { return c.rwr () + vcomma; },
    char_any: function (c) { return c.rwr () },
    separator: function (c) { return c.rwr () },
    semiColonComment: function (semicolon, cs, nl) { return semicolon.rwr () + cs.rwr ().join ('') + nl.rwr (); },

    _terminal: function() { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); }
}
