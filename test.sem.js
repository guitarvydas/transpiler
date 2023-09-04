{
    main : function (_k, _nl) {
	var s = _k.walk ().join ('');
	return s;
    },

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.walk ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

