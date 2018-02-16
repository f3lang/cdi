const uuid = require('uuid').v4;

class Route {

	constructor(bike) {
		this.bike = bike;
		this.uuid = uuid();
	}

}

module.exports = Route;
module.exports.scope = ['prototype'];
module.exports.inject = ['BikePrototype'];