const uuid = require('uuid').v4;

class Class4 {

	constructor(arg1) {
		this.uuid = uuid();
	}

}

module.exports = Class4;
module.exports.inject = ['Banana'];
module.exports.scope = 'singleton';