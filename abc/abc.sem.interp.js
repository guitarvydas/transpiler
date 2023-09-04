{

    TopLevel: function (assignments) {
        var dontcare = assignments.walk ();
        return symbolTable.symbolTable;
    },
    
    Assignment_simple: function (v, keq, n) {
        var name = v.walk ();
        var value = n.walk ();
        symbolTable.symbolTable[name] = value;
    },

    Assignment_complex: function (v, keq, expr) {
        let value = expr.walk ();
        symbolTable.symbolTable[v.walk ()] = value;
    },

    Expression: function (v1, kplus, v2) {
        let name1 = v1.walk ();
        let name2 = v2.walk ();
        let value1 = symbolTable.symbolTable [name1];
        let value2 = symbolTable.symbolTable [name2];
        return value1 + value2;
    },

    Variable: function (c) {
        return this.sourceString;
    },

    number: function (ds) {
        return parseInt (this.sourceString);
    }    
}
