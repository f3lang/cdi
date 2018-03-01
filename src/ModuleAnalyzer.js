/**
 * The module analyzer will analyze modules. no shit.
 * Jokes aside. It will analyze, which modules need
 * to be injected, what can be resolved through configuration
 * and what needs to be resolved by the Object Manager
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class ModuleAnalyzer {

	constructor(objectManager) {
		this.objectManager = objectManager;
	}

	analyze(module) {
		let moduleProperties = Object.getOwnPropertyNames(module);
		let dependencies = moduleProperties.indexOf('inject') > -1 ? module.inject || [] : [];

		return {
			injectMap: dependencies.map(dep => {
				if (dep.substring(0, 7) === 'config:') {
					return this.objectManager.getConfigInjector(dep);
				} else {
					return this.objectManager.getModuleInjector(dep);
				}
			}),
			scope: moduleProperties.indexOf('scope') ? module.scope || 'singleton' : 'singleton'
		};
	}

}

module.exports = ModuleAnalyzer;
module.exports.inject = ['ObjectManager'];
module.exports.scope = 'singleton';