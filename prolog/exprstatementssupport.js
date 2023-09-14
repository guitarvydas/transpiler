_ = {
    statementvaluestack: [0],
    clearstatementvalue: function () {
	_.statementvaluestack = [0];
    },
    statementvaluetop: function () {
	let top = _.statementvaluestack.pop ();
	_.statementvaluestack.push (top);
	return `_${top}`;
    },
    statementvaluepop: function () {
	let top = _.statementvaluestack.pop ();
	return `_${top}`;
    },
    statementvalueprev: function () {
	let top = _.statementvaluestack.pop ();
	let next = _.statementvaluestack.pop ();
	_.statementvaluestack.push (next);
	_.statementvaluestack.push (top);
	return `_${next}`;
    },
    statementvaluenew: function () {
	let top = _.statementvaluestack.pop ();
	_.statementvaluestack.push (top);
	let rnew = top + 1;
	_.statementvaluestack.push (rnew);
    }
},
