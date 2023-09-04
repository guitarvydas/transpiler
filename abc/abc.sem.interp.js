symbolTable = {},
{

    TopLevel: function (assignments) {
        var dontcare = assignments.rwr ();
        return symbolTable;
    },
    
    Assignment_simple: function (v, keq, n) {
        var name = v.rwr ();
        var value = n.rwr ();
        symbolTable[name] = value;
    },

    Assignment_complex: function (v, keq, expr) {
        let value = expr.rwr ();
        symbolTable[v.rwr ()] = value;
    },

    Expression: function (v1, kplus, v2) {
        let name1 = v1.rwr ();
        let name2 = v2.rwr ();
        let value1 = symbolTable [name1];
        let value2 = symbolTable [name2];
        return value1 + value2;
    },

    Variable: function (c) {
        return this.sourceString;
    },

    number: function (ds) {
        return parseInt (this.sourceString);
    },

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); },

}
