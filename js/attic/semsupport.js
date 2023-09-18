_ = {
    retstack: [0],
    clearret: function () {
	_.retstack = [0];
    },
    rettop: function () {
	let top = _.retstack.pop ();
	_.retstack.push (top);
	return `_${top}`;
    },
    retpop: function () {
	let top = _.retstack.pop ();
	return `_${top}`;
    },
    retprev: function () {
	let top = _.retstack.pop ();
	let next = _.retstack.pop ();
	_.retstack.push (next);
	_.retstack.push (top);
	return `_${next}`;
    },
    retnew: function () {
	let top = _.retstack.pop ();
	_.retstack.push (top);
	let rnew = top + 1;
	_.retstack.push (rnew);
    }
},

