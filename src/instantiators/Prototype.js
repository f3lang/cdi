const AbstractInstantiator = require('./AbstractInstantiator');

/**
 * The prototype instantiator will always create a new instance for every request.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class Prototype extends  AbstractInstantiator {

	constructor(objectManager, prototypeWrapper){
		super();
		this.objectManager = objectManager;
		this.prototypeWrapper = prototypeWrapper;
		this.requestCollection = [];
	}

	getInstance(path, config, root, requestId) {
		if(super.requestIsCircular(path, root, requestId)) {
			return;
		}
		let params = this.objectManager.getModuleParams(config.injectMap, root, requestId);
		delete require.cache[require.resolve(path)];
		let resolvedModuleData = this.prototypeWrapper.require(path, root, requestId);
		let module = resolvedModuleData.targetPrototype;
		module.tree = root;
		let instance = new module(...params);
		if(resolvedModuleData.originalChain) {
			this.prototypeWrapper.restoreOriginalPrototypeChain(resolvedModuleData.originalChain);
		}
		return instance;
	}
}

module.exports = Prototype;
module.exports.inject = ['ObjectManager'];