const expect = require('chai').expect;
const ModuleAnalyzer = require('../src/ModuleAnalyzer');

let objectManagerMock = {
	getConfigInjector: (dependency) => {
		return {
			type: 'config',
			path: 'my.cool.config',
			root: 'cdi',
			identifier: dependency
		}
	},
	getModuleInjector: (dependency) => {
		return {
			type: 'module',
			tree: 'root',
			module: 'myCoolModule',
			moduleIdentifier: dependency
		}
	}
};

let ma = new ModuleAnalyzer(objectManagerMock);

describe("Module Analyzer", function () {

	it("analyzes defined dependencies", function () {
		let module = require('./src/classes/class1');
		let result = ma.analyze(module);
		let expectedResult = {
			injectMap: [
				{
					type: 'module',
					tree: 'root',
					module: 'myCoolModule',
					moduleIdentifier: 'Banana'
				},
				{
					type: 'module',
					tree: 'root',
					module: 'myCoolModule',
					moduleIdentifier: 'Rama'
				},
				{
					type: 'config',
					path: 'my.cool.config',
					root: 'cdi',
					identifier: 'config:test'
				}],
			scope: 'singleton'
		};
		expect(result).to.eql(expectedResult);
	});

	it("correctly uses singleton as default scope", function () {
		let module = require('./src/classes/class2');
		let result = ma.analyze(module);
		expect(result.scope).to.equal('singleton');
	});

	it("understands empty inject definitions", function () {
		let module = require('./src/classes/class3');
		let result = ma.analyze(module);
		expect(result.injectMap).to.eql([]);
	});

	it("can detect module injection", function () {
		let module = require('./src/classes/class4');
		let result = ma.analyze(module);
		expect(result.injectMap[0].type).to.equal('module');
	});

	it("can detect config injection", function () {
		let module = require('./src/classes/class5');
		let result = ma.analyze(module);
		expect(result.injectMap[0].type).to.equal('config');
	});

});