const uuid = require('uuid').v4;
const Vehicle = require('./Vehicle');

class Bike extends Vehicle {

	constructor(route) {
		super();
		this.route = route;
		this.uuid = uuid();
	}

}

module.exports = Bike;
module.exports.scope = ['singleton'];
module.exports.inject = ['Route:root'];