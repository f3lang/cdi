const uuid = require('uuid').v4;

class Class5 {

	constructor(setting) {
		this.uuid = uuid();
	}

}

module.exports = Class5;
module.exports.inject = ['config::Banana'];
module.exports.scope = 'singleton';