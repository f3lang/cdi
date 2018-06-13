/**
 * @typedef Object PrototypeWrap
 * @property {Object} targetPrototype The proxied and wired up prototype to use
 * @property {Array} originalChain The original prototype chain to use later to restore the prototype
 */

/**
 * The Prototype Wrapper will resolve dependencies up in the prototype tree.
 * If you require a module which inherits other prototypes, this wrapper will insert proxies in
 * between the inheritance steps which then will handle the dependency injections in the parent
 * prototypes. You can still call super() with arguments in the constructor, the supplied arguments
 * will then be appended to the injected properties in the constructor of the parent prototype.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class PrototypeWrapper {

	constructor(objectManager) {
		this.objectManager = objectManager;
	}

	/**
	 * Will wrap the node require and inject prototype proxies for the dependency injection.
	 * @param {String} module The path of the module to require
	 * @param {String} root The identifier of the tree to work in
	 * @param {String} requestId The id of the current injection request
	 * @return {PrototypeWrap} An Object containing the resolved prototype and the original chain
	 */
	require(module, root, requestId) {
		let mod = require(module);
		let prototypeChain = this.buildPrototypeChain(mod);
		if (prototypeChain.length === 1) {
			// no chain detected so we can continue with a regular require()
			return {targetPrototype: mod, originalChain: null};
		} else if (prototypeChain.length === 2) {
			// chain with one level of inheritance detected
			let targetPrototype = prototypeChain[0];
			let wrappedParentPrototype = this.wrapPrototype(prototypeChain[1], root, requestId + prototypeChain[1].name);
			Object.setPrototypeOf(targetPrototype, wrappedParentPrototype);
			return {targetPrototype, originalChain: prototypeChain};
		}
		// more complex chain detected with multiple levels of inheritance
		let originalChain = prototypeChain.slice();
		let i = prototypeChain.length;
		let targetPrototype = prototypeChain[i - 2];
		while (i-- && i > 1) {
			let upperPrototype = prototypeChain[i];
			let proxiedUpperPrototype = this.wrapPrototype(upperPrototype, root, requestId + upperPrototype.name);
			Object.setPrototypeOf(targetPrototype, proxiedUpperPrototype);
			prototypeChain[i - 1] = targetPrototype;
			targetPrototype = prototypeChain[i - 2];
		}
		Object.setPrototypeOf(targetPrototype, prototypeChain[1]);
		return {targetPrototype, originalChain};
	}

	/**
	 * Will traverse the prototype chain recursively up to the top and convert
	 * it to an array.
	 * @param {Object} prototype The prototype to build a chain for
	 * @return {Array} An array with all prototypes of the chain ordered from bottom to top.
	 */
	buildPrototypeChain(prototype) {
		let chain = [];
		chain.push(prototype);
		if (Object.getPrototypeOf(prototype) !== Object.getPrototypeOf(class {
			})) {
			chain.push(...this.buildPrototypeChain(Object.getPrototypeOf(prototype)));
		}
		return chain;
	}

	/**
	 * Will wrap a prototype in a proxy, that will inject the dependencies into the
	 * original prototype constructor.
	 * @param {Object} prototype The prototype to wrap
	 * @param {String} root The identifier of the tree to work in
	 * @param {String} requestId The id of the current injection request
	 * @return {Object} The wrapped prototype
	 */
	wrapPrototype(prototype, root, requestId) {
		let injectConfiguration = this.objectManager.getInjectionConfiguration(prototype.name);
		prototype.tree = root;
		if (!injectConfiguration || injectConfiguration.config.injectMap.length === 0) {
			return prototype;
		}
		let params = this.objectManager.getModuleParams(injectConfiguration.config.injectMap, root, requestId);
		return class extends prototype {
			constructor(...args) {
				module.exports.tree = root;
				super(...params, ...args);
			}
		};
	}

	/**
	 * After instantiation of the module it is important to restore the original
	 * prototype tree, since node will somehow cache it, which will lead to problems
	 * when traversing the tree again.
	 * @param {Array} originalChain The original prototype chain as an Array
	 */
	restoreOriginalPrototypeChain(originalChain) {
		if (originalChain.length === 2) {
			Object.setPrototypeOf(originalChain[0], originalChain[1]);
			return;
		}
		let i = originalChain.length - 1;
		while (i--) {
			Object.setPrototypeOf(originalChain[i], originalChain[i + 1]);
		}
	}

}

module.exports = PrototypeWrapper;
module.exports.inject = ['ObjectManager'];