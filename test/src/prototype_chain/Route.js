const uuid = require('uuid').v4;

class Route {

	constructor() {
		this.uuid = uuid();
	}

}

module.exports = Route;
module.exports.scope = ['prototype'];