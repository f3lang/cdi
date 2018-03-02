const Floatable = require('../out_of_scope/Floatable');

class Ship extends Floatable {

	constructor(load) {
		super();
		this.load = load;
	}

}

module.exports = Ship;
module.exports.inject = ['MotorBike'];