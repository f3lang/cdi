/**
 * The Config Resolver is the central manager for configurations.
 * It offers the functionality to resolve configuration entries based on the injected config path.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class ConfigResolver {

	constructor(configs) {
		this.configs = configs || {};
		this.cache = {};
	}

	/**
	 * Adds a new configuration to the collection
	 * @param configuration The configuration object
	 * @param root The configuration root name
	 */
	addConfiguration(configuration, root) {
		this.configs[root] = configuration;
	}

	/**
	 * Returns a configuration entry of the available configurations
	 * @param root The configuration root to look in
	 * @param path The path of the configuration to return
	 * @return {*}
	 */
	getConfig(root, path) {
		if (root === '' && path === '') {
			return this.configs;
		}
		if (this.cache[root + ":" + path]) {
			return this.cache[root + ":" + path]
		}
		if (!this.configs[root]) {
			throw new Error('Configuration root "' + root + '" does not exist');
		}
		if (path === "" || path === ".") {
			return this.configs[root];
		}
		try {
			let property = this._getProperty(this.configs[root], path.split('.'));
			this.cache[root + ":" + path] = property;
			return property;
		} catch (e) {
			throw new Error('Configuration path "' + path + '" does not exist in configuration root "' + root + '"');
		}
	}

	/**
	 * Returns the next available property of obj.
	 * e.g.:
	 * Your obj:
	 * {
	 * 		banana: {
	 * 			fruit: {
	 * 				price: 1
	 * 			}
	 * 		}
	 * }
	 * and your path will be ['banana', 'fruit', 'price']
	 * Then this function will return 1
	 *
	 * @param obj
	 * @param propertyPathArray
	 * @private
	 */
	_getProperty(obj, propertyPathArray) {
		if (propertyPathArray.length === 1) {
			return obj[propertyPathArray[0]];
		} else {
			return this._getProperty(obj[propertyPathArray.shift()], propertyPathArray);
		}
	}

}

module.exports = ConfigResolver;
module.exports.inject = ['config::'];