const uuid = require('uuid').v4;

class Class7 {

	constructor(setting) {
		this.uuid = uuid();
	}

}

module.exports = Class7;
module.exports.inject = ['config::Banana'];
module.exports.scope = 'singleton';
module.exports.alias = ['Class6'];