/**
 * @typedef {Object} Injector
 * @property {String} type The type of data to inject. May be either module or config
 * @property {String} tree The tree to use for injection.
 * @property {String} module The resolved module to inject
 * @property {String} moduleIdentifier The raw module identifier
 * @property {String} root The configuration root to use for the configuration
 * @property {String} path The configuration path to use for the injection
 * @property {String} identifier The raw configuration identifier
 */

/**
 * @typedef {Object} InjectionConfiguration
 * @property {String} path The path of the module source file
 * @property {String} name The name of the module in the object manager
 * @property {String} originModuleName Since you can use aliases for a module, you need to know the original module name. Here it is ;)
 * @property {Object} config The configuration of the module injection setup
 * @property {String} [config.scope=singleton] The scope of the module.
 * @property {Injector[]} config.injectMap The inject map consisting of multiple Injector properties
 */


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