const expect = require('chai').expect;
const ObjectManager = require('../src/ObjectManager');
const AbstractInstantiator = require('../src/instantiators/AbstractInstantiator');
const path = require('path');

let cacheFile = path.join(__dirname, 'cache', 'object_manager_cdi.json');
let classPath = path.join(__dirname, 'src', 'testcase');
let classPathCircular = path.join(__dirname, 'src', 'circular');
let classPathPrototype = path.join(__dirname, 'src', 'prototype_chain');

let testConfiguration = {
	fruit: {
		name: "banana"
	}
};

describe("Object Manager", function () {

	it("will initialize", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath],
			cacheFile
		});
	});

	it("will initialize with default options", function () {
		let objectManager = new ObjectManager();
	});

	it("will instantiate an object", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath]
		});
		let bike = objectManager.requestInstanceOfModule("Bike");
	});

	it("won't crash on circular dependencies", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPathCircular]
		});
		let CONSOLE_WARN_ORIG = console.warn;
		let console_out = "";
		console.warn = (val) => {
			console_out = val;
		};
		let bike = objectManager.getInstance("Bike");
		expect(console_out).not.to.equal("");
		expect(bike.wheelConfiguration.bike).to.equal(undefined);
		console_out = "";
		bike = objectManager.getInstance("BikePrototype");
		expect(console_out).not.to.equal("");
		expect(bike.route.bike).to.equal(undefined);
		console.warn = CONSOLE_WARN_ORIG;
	});

	it("will fail on requesting an invalid instantiator", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath],
			configurations: {test: testConfiguration}
		});
		expect(() => objectManager.getInstantiator("bananarama")).to.throw();
	});

	it("will fail on requesting a non existing module", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath],
			configurations: {test: testConfiguration}
		});
		expect(() => objectManager.getInstance("bananarama")).to.throw();
	});

	it("won't add duplicated dependency trees", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath],
			configurations: {test: testConfiguration}
		});
		objectManager.addDependencyTree("banana");
		expect(() => objectManager.addDependencyTree("banana")).to.throw();
	});

	it("abstract instantiator will fail", function () {
		let abstractInstantiator = new AbstractInstantiator();
		expect(() => abstractInstantiator.getInstance()).to.throw();
	});

	describe("Config Injection", function () {

		it("will inject configurations", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			objectManager.addConfiguration(testConfiguration, "test");
			let bike = objectManager.getInstance("BikeWithConfig");
			expect(bike.fruitName).to.equal(testConfiguration.fruit.name);
		});

		it("won't add a configuration more than once", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			objectManager.addConfiguration(testConfiguration, "test");
			expect(() => objectManager.addConfiguration(testConfiguration, "test")).to.throw();
		});

		it("will add configuration on init", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath],
				configurations: {test: testConfiguration}
			});
			let bike = objectManager.getInstance("BikeWithConfig");
			expect(bike.fruitName).to.equal(testConfiguration.fruit.name);
		});

	});

	describe("Module Injection", function () {

		it("will inject modules", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			expect(bike.wheelConfiguration).not.to.equal(undefined);
		});

		it("will only return one instance in the same tree", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let bike2 = objectManager.getInstance("Bike");
			expect(bike.uuid).to.equal(bike2.uuid);
		});

		it("prototyped instances work", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let anotherRoute = objectManager.getInstance("Route");
			expect(anotherRoute.uuid).not.to.equal(bike.route.uuid);
		});

		it("singleton instances will stay the same", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let wheelConfiguration = objectManager.getInstance("WheelConfiguration");
			expect(wheelConfiguration.uuid).to.equal(bike.wheelConfiguration.uuid);
		});

		it("instances in a different tree may be requested", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let wheelConfiguration = objectManager.getInstance("WheelConfiguration", "mine");
			expect(wheelConfiguration.uuid).not.to.equal(bike.wheelConfiguration.uuid);
		});

		it("instance can access the tree id", function(){
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let wheelConfiguration = objectManager.getInstance("WheelConfiguration", "mine");
			expect(wheelConfiguration.getTreeName()).to.equal("mine");
		});

		it("instance tree may be forced", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let myBike = objectManager.getInstance("Bike", "mine");
			expect(myBike.wheelConfiguration.uuid).to.equal(bike.wheelConfiguration.uuid);
		});

	});

	describe("Global Scope", function () {

		it("will use an existing instance in the global scope with enabled global scope", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath],
				globalScope: true
			});
			let bike = objectManager.getInstance("Bike");
			let objectManager2 = new ObjectManager({
				moduleSrc: [classPath],
				globalScope: true
			});
			let bike2 = objectManager2.getInstance("Bike");
			expect(bike).to.eql(bike2);
		});

		it("will not use the global scope, if not enabled", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike = objectManager.getInstance("Bike");
			let objectManager2 = new ObjectManager({
				moduleSrc: [classPath]
			});
			let bike2 = objectManager2.getInstance("Bike");
			expect(bike.uuid).not.to.eql(bike2.uuid);
		});

	});

	describe("Prototype traversal", function () {

		it("will work on prototype extension (es6 syntax 'extends className')", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let bike = objectManager.getInstance('Bike');
			expect(bike.wheelConfiguration).to.exist;
		});

		it("injection will use existing instance", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let wheelConfiguration = objectManager.getInstance('WheelConfiguration');
			let bike = objectManager.getInstance('Bike');
			expect(bike.wheelConfiguration.uuid).to.eql(wheelConfiguration.uuid);
		});

		it("will allow constructor arguments in parent classes", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let car = objectManager.getInstance('Car');
			expect(car.unique_color).to.eql(car.color);
		});

		it("will jump over classes without injection", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let motorBike = objectManager.getInstance('MotorBike');
			let wheelConfiguration = objectManager.getInstance('WheelConfiguration');
			expect(motorBike.wheelConfiguration.uuid).to.eql(wheelConfiguration.uuid);
		});

		it("will still work with external classes out of scope", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let ship = objectManager.getInstance('Ship');
			expect(ship.floats).to.be.true;
		});

		it("will cleanup the prototype chain after initialization", function () {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let motorBike = objectManager.getInstance('MotorBike');
			let objectManager2 = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let motorBike2 = objectManager2.getInstance('MotorBike');
			expect(motorBike2.color).to.eql('green');
		});

		it("traversion of dependency tree will work", function() {
			let objectManager = new ObjectManager({
				moduleSrc: [classPathPrototype]
			});
			let bike = objectManager.getInstance('Bike', 'mine');
			expect(bike.getHighestLevelTree()).to.equal('mine');
		})

	});

	it("will return internal module instances", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath]
		});
		expect(objectManager.getInstance("ObjectManager")).to.eql(objectManager);
		expect(objectManager.getInstance("DependencyTree", "root")).to.eql(objectManager.trees.root);
		expect(objectManager.getInstance("ConfigResolver")).to.eql(objectManager.configResolver);
		expect(objectManager.getInstance("ModuleResolver")).to.eql(objectManager.moduleResolver);
		expect(objectManager.getInstance("ModuleAnalyzer")).to.eql(objectManager.moduleAnalyzer);
	});

	it("will create a new tree if nessecary", function () {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath]
		});
		expect(objectManager.getInstance("DependencyTree", "banana")).to.eql(objectManager.trees.banana);
	});

	it("will create a new unique request id for each dependency request", function() {
		let objectManager = new ObjectManager({
			moduleSrc: [classPath]
		});
		objectManager.trees["mockTree"] = {
			getInstance: (moduleName, _requestId) => {
				return _requestId;
			}
		};
		expect(objectManager.getInstance("Irrelevant", "mockTree")).not.to.eql(objectManager.getInstance("Irrelevant", "mockTree"));
		expect(objectManager.getInstance("Irrelevant", "mockTree")).to.be.lessThan(objectManager.getInstance("Irrelevant", "mockTree"));
	});

});