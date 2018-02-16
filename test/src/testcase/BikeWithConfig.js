const uuid = require('uuid').v4;

class BikeWithConfig {

	constructor(fruitName) {
		this.fruitName = fruitName;
	}

}

module.exports = BikeWithConfig;
module.exports.inject = ['config:test:fruit.name'];