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
	 * @param {PrototypeWrapper} prototypeWrapper
	 */
	constructor(objectManager, prototypeWrapper) {
		super();
		this.cache = {};
		this.objectManager = objectManager;
		this.prototypeWrapper = prototypeWrapper;
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
		let resolvedModuleData = this.prototypeWrapper.require(path, root, requestId);
		let module = resolvedModuleData.targetPrototype;
		module.tree = root;
		let instance = new module(...params);
		this.cache[path + ":" + root] = instance;
		if(resolvedModuleData.originalChain) {
			this.prototypeWrapper.restoreOriginalPrototypeChain(resolvedModuleData.originalChain);
		}
		return instance;
	}

}

module.exports = Singleton;
module.exports.inject = ['ObjectManager'];