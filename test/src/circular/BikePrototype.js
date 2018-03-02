const uuid = require('uuid').v4;

class BikePrototype {

	constructor(route) {
		this.route = route;
		this.uuid = uuid();
	}

}

module.exports = BikePrototype;
module.exports.scope = 'prototype';
module.exports.inject = ['Route'];