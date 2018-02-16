const uuid = require('uuid').v4;

class Class1 {

	constructor(arg1, arg2, arg3) {
		this.uuid = uuid();
	}

}

module.exports = Class1;
module.exports.inject = ['Banana', 'Rama', 'config:test'];
module.exports.scope = 'singleton';