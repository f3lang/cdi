const uuid = require('uuid').v4;
const Vehicle = require('./Vehicle');

class Car extends Vehicle {

	constructor(route) {
		let color = uuid();
		super(color);
		this.unique_color = color;
		this.route = route;
		this.uuid = uuid();
	}

}

module.exports = Car;
module.exports.scope = 'prototype';
module.exports.inject = ['Route:root'];