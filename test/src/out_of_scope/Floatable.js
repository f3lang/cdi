/**
 * This class is out of the scope of the object manager to test handling and connections of 3rd party classes
 */
class Floatable {

	constructor() {
		this.floats = true;
	}

	makeHole() {
		this.floats = false;
	}

}

module.exports = Floatable;