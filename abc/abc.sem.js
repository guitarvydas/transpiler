{

    TopLevel: function (assignments) {
        var finalString = assignments.rwr ().join ('\n');
        return finalString;
    },
    
    Assignment_simple: function (v, keq, n) {
        var name = v.rwr ();
        var value = n.rwr ();
        return `var ${name} = ${value};`; 
    },

    Assignment_complex: function (v, keq, expr) {
        var name = v.rwr ();
        var value = expr.rwr ();
        return `var ${name} = ${value};`; 
    },

    Expression: function (v1, kplus, v2) {
        let name1 = v1.rwr ();
        let name2 = v2.rwr ();
        return `${name1} + ${name2}`;
    },

    Variable: function (c) {
        return this.sourceString;
    },

    number: function (ds) {
        return this.sourceString;
    },

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },

}
