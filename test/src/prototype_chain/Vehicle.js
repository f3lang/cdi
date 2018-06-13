class Vehicle {

	constructor(wheelConfiguration, color) {
		this.wheelConfiguration = wheelConfiguration;
		this.color = color;
	}

	getHighestLevelTree(){
		return module.exports.tree;
	}

}

module.exports = Vehicle;
module.exports.inject = ["WheelConfiguration"];