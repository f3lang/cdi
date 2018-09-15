const uuid = require('uuid').v4;
class Test1 {

	constructor() {
		this.targetClass = "Test1";
		this.id = uuid();
	}

}

module.exports = Test1;