const AbstractInstantiator = require('./AbstractInstantiator');

/**
 * The singleton instantiator will create a maximum of one instance of a module per dependency tree.
 * When you request an already instantiated module, the singleton instantiator will return you the
 * already instantiated module.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class Singleton extends AbstractInstantiator {

	/**
	 * @param {ObjectManager} objectManager
	 */
	constructor(objectManager) {
		super();
		this.cache = {};
		this.objectManager = objectManager;
		this.requestCollection = [];
	}

	getInstance(path, config, root, requestId) {
		if(this.cache[path + ":" + root]) {
			return this.cache[path + ":" + root];
		}
		if(super.requestIsCircular(path, root, requestId)) {
			return;
		}
		let params = this.objectManager.getModuleParams(config.injectMap, root, requestId);
		delete require.cache[require.resolve(path)];
		let module = require(path);
		module.tree = root;
		let instance = new module(...params);
		this.cache[path + ":" + root] = instance;
		return instance;
	}

}

module.exports = Singleton;
module.exports.inject = ['ObjectManager'];