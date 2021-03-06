const uuid = require('uuid').v4;

class Bike {

	constructor(wheelConfiguration, route) {
		this.wheelConfiguration = wheelConfiguration;
		this.route = route;
		this.uuid = uuid();
	}

}

module.exports = Bike;
module.exports.scope = 'singleton';
module.exports.inject = ['WheelConfiguration:root', 'Route:root'];
module.exports.alias = ['VeryCoolVehicle'];