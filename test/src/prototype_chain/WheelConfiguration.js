const uuid = require('uuid').v4;

class WheelConfiguration {

	constructor(){
		this.uuid = uuid();
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
