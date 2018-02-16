const uuid = require('uuid').v4;

class Class2 {

	constructor(arg1, arg2, arg3) {
		this.uuid = uuid();
	}

}

module.exports = Class2;
module.exports.inject = ['Banana', 'Rama', 'config:test'];