const uuid = require('uuid').v4;
class Test2 {

	constructor() {
		this.targetClass = "Test2";
		this.id = uuid();
	}

}

module.exports = Test2;