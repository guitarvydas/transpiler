{
    main : function (_k) {
	var s = _k.walk ();
	console.log ("in test.sem.js/main...");
	console.log (s);
    },

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._rwr ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
