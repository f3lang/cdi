const path = require('path');
const fs = require('fs');

/**
 * The module resolver will resolve modules and converts their inject information into
 * a set of information, the objectManager needs in order to handle injection properly
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class ModuleResolver {

	/**
	 * @param moduleSrc An array with absolute paths to folders including
	 * modules to use for injection
	 * @param cacheFile A path to a json file, that should be used as a cache.
	 * @param moduleAnalyzer
	 */
	constructor(moduleSrc, cacheFile, moduleAnalyzer) {
		this.cache = {
			moduleMap: {},
			fileCache: {}
		};
		if (cacheFile) {
			this.cacheFile = cacheFile;
			if (fs.existsSync(cacheFile)) {
				this.cache = require(cacheFile);
			}
		}
		this.moduleAnalyzer = moduleAnalyzer;
		this.nameCollisionMap = [];

		let modulePathList = [];
		let i = moduleSrc.length;
		while (i--) {
			this.addModuleSrcDir(moduleSrc[i]);
		}
		if (cacheFile) {
			this.writeCache();
		}
	}

	/**
	 * Add an additional source directory to the Module Resolver
	 * @param {string} dir The directory to parse
	 */
	addModuleSrcDir(dir) {
		let modulePaths = fs.readdirSync(dir);
		modulePaths.forEach(src => {
			let stat = fs.statSync(path.join(dir, src));
			if (stat.isDirectory()) {
				this.addModuleSrcDir(path.join(dir, src));
			} else {
				if (path.extname(src).toLowerCase() === '.js') {
					this.processModule(path.join(dir, src), stat);
				}
			}
		});
		if (this.cacheFile) {
			this.writeCache();
		}
	}

	/**
	 * Fetches the module and handles caching.
	 * @param modulePath The absolute path to the module source file
	 * @param stat The stat of the module file
	 */
	processModule(modulePath, stat) {
		if (this.cacheFile) {
			if (this.cache.fileCache[path.basename(modulePath)]) {
				let stat = fs.statSync(modulePath);
				if (this.cache.fileCache[path.basename(modulePath)].mtimeMs < stat.mtimeMs) {
					this.cache.fileCache[path.basename(modulePath)].mtimeMs = stat.mtimeMs;
					this.fetchModule(modulePath);
				}
			} else {
				let stat = fs.statSync(modulePath);
				this.cache.fileCache[path.basename(modulePath)] = {
					mtimeMs: stat.mtimeMs
				};
				this.fetchModule(modulePath);
			}
		} else {
			this.fetchModule(modulePath);
		}
	}

	/**
	 * Fetches the module information and puts them into the cache.
	 * @param modulePath The path to the module. Has to be resolvable by require()
	 * @return {Promise<any>}
	 */
	fetchModule(modulePath) {
		let module = require(modulePath);
		let moduleConfig = this.moduleAnalyzer.analyze(module);
		let moduleNames = module.alias || [];
		moduleNames.push(module.name);
		let i = moduleNames.length;
		while (i--) {
			if (this.nameCollisionMap.indexOf(moduleNames[i]) > -1) {
				throw new Error("module name " + moduleNames[i] + " is already in use");
			}
		}
		moduleNames.forEach(name => {
			this.nameCollisionMap.push(name);
			this.cache.moduleMap[name] = {
				path: modulePath,
				config: moduleConfig,
				name: name,
				originModuleName: module.name
			}
		});
	}

	/**
	 * Get the complete set of resolved modules
	 * @return {{moduleMap: {}, fileCache: {}}|*}
	 */
	getResolvedModules() {
		return this.cache;
	}

	/**
	 * Write the cache file.
	 */
	writeCache() {
		fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, '\t'));
	}

}

module.exports = ModuleResolver;
module.exports.inject = ['config:cdi:moduleSrc', 'config:cdi:resolver.cacheFile', 'ModuleAnalyzer'];