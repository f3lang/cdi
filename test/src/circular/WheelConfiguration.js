const uuid = require('uuid').v4;

class WheelConfiguration {

	constructor(bike) {
		this.uuid = uuid();
		this.bike = bike;
		this.wheels = {
			1: true,
			2: true,
			3: false,
			4: false
		};
	}

}

module.exports = WheelConfiguration;
module.exports.scope = 'singleton';
module.exports.inject = ['Bike'];
