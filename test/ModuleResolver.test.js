const expect = require('chai').expect;
const assert = require('chai').assert;
const ModuleResolver = require('../src/ModuleResolver');
const path = require('path');

let moduleAnalyzerMock = {
	analyze: (module) => {
		return {
			banana: 'rama'
		};
	}
};

const fs = require('fs');

if (fs.existsSync(path.join(__dirname, 'cache', 'cdi.json'))) {
	fs.unlinkSync(path.join(__dirname, 'cache', 'cdi.json'));
}

let classPathIncludingRecursive = path.join(__dirname, 'src', 'classes');
let simpleClassPath = path.join(__dirname, 'src', 'classes', 'recursive');
let cacheFilePath = path.join(__dirname, 'cache', 'cdi.json');

describe("Module Resolver", function () {

	describe("Module resolution", function () {

		it("can resolve modules in a path", function () {
			let moduleResolver = new ModuleResolver([simpleClassPath], null, moduleAnalyzerMock);
		});

		it("can recursively resolve modules in a path", function () {
			let moduleResolver = new ModuleResolver([classPathIncludingRecursive], null, moduleAnalyzerMock);
		});

		it("returns the resolved modules after resolving them in getResolvedModules()", function () {
			let moduleResolver = new ModuleResolver([simpleClassPath], null, moduleAnalyzerMock);
			let result = moduleResolver.getResolvedModules();
			expect(result.moduleMap.Class6.name).to.equal("Class6");
			expect(result.moduleMap.Class7.name).to.equal("Class7");
		});

		it("can handle class name alias", function () {
			let moduleResolver = new ModuleResolver([simpleClassPath], null, moduleAnalyzerMock);
			let result = moduleResolver.getResolvedModules();
			expect(result.moduleMap.Class8.name).to.equal("Class8");
			expect(result.moduleMap.Class8.originModuleName).to.equal("Class7");
		});

		it("can detect duplicated class names/alias and will fail", function () {
			expect(() => {
				new ModuleResolver([path.join(__dirname, 'src/errorClasses')], null, moduleAnalyzerMock)
			}).to.throw();
		});

		it("will ignore non .js file in the path", function() {
			let moduleResolver = new ModuleResolver([simpleClassPath], null, moduleAnalyzerMock);
			expect(moduleResolver.getResolvedModules().fileCache['gibberish.md']).not.exist;
		});

	});

	describe("Caching", function () {

		it("will create a new cachefile", function () {
			let moduleResolver = new ModuleResolver([simpleClassPath], cacheFilePath, moduleAnalyzerMock);
			expect(fs.existsSync(cacheFilePath)).to.be.true;
		});

		it("will use an existing cachefile", function () {
			new ModuleResolver([simpleClassPath], cacheFilePath, moduleAnalyzerMock);
			expect(fs.existsSync(cacheFilePath)).to.be.true;
			let moduleResolver = new ModuleResolver([], cacheFilePath, moduleAnalyzerMock);
			expect(moduleResolver.cache.moduleMap.Class6).to.exist;
		});

		it("will reload the module if it was changed", function () {
			let moduleResolver = new ModuleResolver([simpleClassPath], cacheFilePath, moduleAnalyzerMock);
			fs.writeFileSync(path.join(simpleClassPath, 'class6.js'), fs.readFileSync(path.join(simpleClassPath, 'class6.js'), 'utf8'));
			let oldmtime = moduleResolver.getResolvedModules().fileCache['class6.js'].mtimeMs;
			moduleResolver = new ModuleResolver([simpleClassPath], cacheFilePath, moduleAnalyzerMock);
			expect(oldmtime).to.be.lessThan(moduleResolver.getResolvedModules().fileCache['class6.js'].mtimeMs);
		});

	});

});