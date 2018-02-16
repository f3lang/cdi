const expect = require('chai').expect;
const ConfigResolver = require('../src/ConfigResolver');

let configrationTest = {
	my: {
		cool: {
			config: 1
		}
	}
};

describe("Config Resolver", function () {

	it("can resolve configurations", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		expect(configResolver.getConfig("test", "")).to.eql(configrationTest);
	});

	it("can resolve nested configurations", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		expect(configResolver.getConfig("test", "my.cool.config")).to.equal(1);
	});

	it("resolved default paths correctly", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		expect(configResolver.getConfig("test", "")).to.eql(configrationTest);
		expect(configResolver.getConfig("test", ".")).to.eql(configrationTest);
	});

	it("will fail on non existing paths", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		expect(() => configResolver.getConfig("test", "my.really.cool.config")).to.throw();
	});

	it("will return the whole configuration set if requested", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		expect(configResolver.getConfig("", "")).to.eql({test: configrationTest});
	});

	it("will return cached values", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		let testValue = configResolver.getConfig("test", "my.cool.config");
		configResolver.configs.test.my.cool.config = 2;
		expect(configResolver.getConfig("test", "my.cool.config")).to.equal(testValue);
	});

	it("will throw an error, if a non existing configuration root is requested", function () {
		let configResolver = new ConfigResolver({test: configrationTest});
		expect(() => configResolver.getConfig("bananarama", "blubb")).to.throw();
	})

});