/**
 * The Prototype Wrapper will resolve dependencies up in the prototype tree.
 * @author Wolfgang Felbermeier (@f3lang)
 */
class PrototypeWrapper {

	constructor(objectManager) {
		this.objectManager = objectManager;
	}

	require(module, root, requestId) {
		let mod = require(module);
		let prototypeChain = this.buildPrototypeChain(mod);
		if (prototypeChain.length === 1) {
			return {targetPrototype: mod};
		} else if (prototypeChain.length === 2) {
			let targetPrototype = prototypeChain[0];
			let wrappedParentPrototype = this.wrapPrototype(prototypeChain[1], root, requestId + prototypeChain[1].name);
			Object.setPrototypeOf(targetPrototype, wrappedParentPrototype);
			return {targetPrototype, originalChain: prototypeChain};
		}
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

	buildPrototypeChain(prototype) {
		let chain = [];
		chain.push(prototype);
		if (Object.getPrototypeOf(prototype) !== Object.getPrototypeOf(class {
			})) {
			chain.push(...this.buildPrototypeChain(Object.getPrototypeOf(prototype)));
		}
		return chain;
	}

	wrapPrototype(prototype, root, requestId) {
		let injectConfiguration = this.objectManager.getInjectionConfiguration(prototype.name);
		if (!injectConfiguration || injectConfiguration.config.injectMap.length === 0) {
			return prototype;
		}
		let params = this.objectManager.getModuleParams(injectConfiguration.config.injectMap, root, requestId);
		return class extends prototype {
			constructor(...args) {
				super(...params, ...args);
			}
		};
	}

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