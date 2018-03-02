class Vehicle {

	constructor(wheelConfiguration, color) {
		this.wheelConfiguration = wheelConfiguration;
		this.color = color;
	}

}

module.exports = Vehicle;
module.exports.inject = ["WheelConfiguration"];