const uuid = require('uuid').v4;
const MotorizedVehicle = require('./MotorizedVehicle');

class MotorBike extends MotorizedVehicle {

	constructor(route) {
		super();
		this.route = route;
		this.uuid = uuid();
	}

}

module.exports = MotorBike;
module.exports.scope = 'singleton';
module.exports.inject = ['Route:root'];