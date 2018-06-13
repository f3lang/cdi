/**
 * The dependency tree keeps track of module dependencies.
 * You can see a dependency tree as some kind of dimension.
 * Multiple instances of one module can exist concurrently in
 * different trees. If you don't explicitly define the tree,
 * a module should reside in, it will also be instantiated in
 * the tree of the parent module.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class DependencyTree {

	/**
	 * @param {ObjectManager} objectManager
	 * @param {ModuleResolver} moduleResolver
	 * @param {String} identifier The identifier of this tree
	 */
	constructor(objectManager, moduleResolver, identifier) {
		this.identifier = identifier;
		this.objectManager = objectManager;
		this.moduleResolver = moduleResolver;
	}

	/**
	 * Returns an instance of the current tree
	 * @param {string} moduleName The name of the module
	 * @param {string} requestId The unique request id to detect circular dependencies
	 */
	getInstance(moduleName, requestId) {
		let moduleMeta = this.moduleResolver.getResolvedModules().moduleMap[moduleName];
		if(!moduleMeta) {
			throw new Error('[cdi] Module with identifier "' + moduleName + '" not found');
		}
		let scope = moduleMeta.config.scope;
		let instantiator = this.objectManager.getInstantiator(scope);
		return instantiator.getInstance(moduleMeta.path, moduleMeta.config, this.identifier, requestId);
	}

}

module.exports = DependencyTree;
module.exports.inject = ['ObjectManager', 'ModuleResolver'];