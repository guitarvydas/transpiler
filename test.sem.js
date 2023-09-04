_sem = {
    main : function (_k, _nl) {
	console.log ("in main");
	_.inner ();
	var s = _k.rwr ().join ('');
	return s;
    },

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; },
},
_ = {
    inner : function () {
	console.log ("in inner");
    }
},
_sem


