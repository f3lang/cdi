const uuid = require('uuid').v4;

class Class6 {

	constructor(arg1) {
		this.uuid = uuid();
	}

}

module.exports = Class6;
module.exports.inject = ['Banana'];
module.exports.scope = 'singleton';