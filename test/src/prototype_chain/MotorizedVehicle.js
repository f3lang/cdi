const uuid = require('uuid').v4;
const Vehicle = require('./Vehicle');

class MotorizedVehicle extends Vehicle {

	constructor() {
		super("green");
	}

}

module.exports = MotorizedVehicle;
module.exports.debug = "blubber";