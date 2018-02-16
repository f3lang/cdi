const AbstractInstantiator = require('./AbstractInstantiator');

/**
 * The prototype instantiator will always create a new instance for every request.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class Prototype extends  AbstractInstantiator {

	constructor(objectManager){
		super();
		this.objectManager = objectManager;
		this.requestCollection = [];
	}

	getInstance(path, config, root, requestId) {
		if(super.requestIsCircular(path, root, requestId)) {
			return;
		}
		let params = this.objectManager.getModuleParams(config.injectMap, root, requestId);
		delete require.cache[require.resolve(path)];
		let module = require(path);
		module.tree = root;
		return new module(...params);
	}
}

module.exports = Prototype;
module.exports.inject = ['ObjectManager'];