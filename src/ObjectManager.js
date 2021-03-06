const ModuleAnalyzer = require('./ModuleAnalyzer');
const ConfigResolver = require('./ConfigResolver');
const Singleton = require('./instantiators/Singleton');
const Prototype = require('./instantiators/Prototype');
const DependencyTree = require('./DependencyTree');
const ModuleResolver = require('./ModuleResolver');
const PrototypeWrapper = require('./instantiators/PrototypeWrapper');

/**
 * The ObjectManager is the central component which instantiates modules,
 * which may be requested by other objects.
 * The ObjectManager works with dependency trees. Each dependency tree
 * has an identifier. The default tree has the identifier "root". If you
 * need a different tree or want to branch the tree so the depending
 * instances have a different set of dependencies, you need either need
 * to call the requestInstance method with a different treeIdentifier
 * or you define the treeIdentifier in the dependency definition of
 * your module.
 *
 * To request an instance, just call getInstance(moduleName)
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class ObjectManager {

	/**
	 * @param {Object} options The configuration options
	 * @param {Array} options.moduleSrc An array with paths to the module source files to autowire
	 * @param {String=} options.cacheFile A file to use as a cache for the module meta data
	 * @param {Object=} options.configurations A set of configurations to use
	 * @param {boolean=} [options.globalScope=false] When set to true, will register the current instance
	 * in the global scope and return it, when requested again. Use this only when necessary and you need to
	 * use the object manager in different locations that cannot be resolved in one scope by the ObjectManager
	 */
	constructor(options) {
		let defaultOptions = {
			moduleSrc: [],
			cacheFile: null,
			configurations: {},
			globalScope: false
		};
		this.options = Object.assign(defaultOptions, options || {});
		if (this.options.globalScope) {
			if (global._cid) {
				return global._cid;
			} else {
				global._cid = this;
			}
		}
		this.trees = {};
		this.configurations = {};
		this.instantiators = {};
		this.moduleAnalyzer = new ModuleAnalyzer(this);
		this.configResolver = new ConfigResolver();
		this.addConfiguration({moduleSrc: this.options.moduleSrc, cacheFile: this.options.cacheFile}, 'cdi');
		Object.keys(this.options.configurations).forEach(key => {
			this.addConfiguration(options.configurations[key], key);
		});
		this.moduleResolver = new ModuleResolver(this.options.moduleSrc, this.options.cacheFile, this.moduleAnalyzer);
		this.prototypeWrapper = new PrototypeWrapper(this);
		this.registerInstantiator('singleton', new Singleton(this, this.prototypeWrapper));
		this.registerInstantiator('prototype', new Prototype(this, this.prototypeWrapper));
		this.addDependencyTree('root');
		this.nextRequestID = 0;
		this.connectedObjectManagers = [];
	}

	/**
	 * Adds a configuration to the Object Manager
	 * @param {object} config The configuration object
	 * @param {String=} root The configuration root, that can be used to inject settings.
	 */
	addConfiguration(config, root = "") {
		if (this.configurations[root]) {
			throw new Error('[cdi] [ObjectManager] Identifier "' + root
				+ '" has already been used by another configuration');
		}
		this.configurations[root] = config;
		this.configResolver.addConfiguration(config, root);
	}

	/**
	 * Returns an instance of a module by name. All dependencies will be injected.
	 * @param {string} moduleName The name of the module. Must match the Module name or one of its alias
	 * @param {string=} tree The tree to use. Defaults to "root"
	 * @return {*} The instance of the module
	 */
	getInstance(moduleName, tree) {
		return this.requestInstanceOfModule(moduleName, tree);
	}

	/**
	 * Requests an instance of a module. All dependencies will be injected also into submodules.
	 * @param {string} moduleName The name of the module. Must match the Module name or one of its alias
	 * @param {string=} treeIdentifier The tree to use. Default is "root"
	 * @param {int=} _requestId Internal parameter to detect circular dependencies
	 * @return {*}
	 */
	requestInstanceOfModule(moduleName, treeIdentifier = 'root', _requestId = this.nextRequestID++) {
		switch (moduleName) {
			case 'ObjectManager':
				return this;
			case 'DependencyTree':
				if (!this.trees[treeIdentifier]) {
					this.addDependencyTree(treeIdentifier);
				}
				return this.trees[treeIdentifier];
			case 'ConfigResolver':
				return this.configResolver;
			case 'ModuleAnalyzer':
				return this.moduleAnalyzer;
			case 'ModuleResolver':
				return this.moduleResolver;
			default:
				if (!this.moduleResolver.getResolvedModules().moduleMap[moduleName]) {
					let targetObjectManager = this.getContainingObjectManager(moduleName);
					if (targetObjectManager) {
						return targetObjectManager.requestInstanceOfModule(moduleName, treeIdentifier, _requestId);
					}
				}
				if (!this.trees[treeIdentifier]) {
					this.addDependencyTree(treeIdentifier);
				}
				return this.trees[treeIdentifier].getInstance(moduleName, _requestId);
		}
	}

	/**
	 * Generates an injector definition for a configuration setting.
	 * @param {string} configurationIdentifier The configuration identifier of the module
	 * @return {{type: string, path: *|string, root: *|string, identifier: *}}
	 */
	getConfigInjector(configurationIdentifier) {
		let configPath = configurationIdentifier.split(':');
		return {
			type: 'config',
			path: configPath[2],
			root: configPath[1],
			identifier: configurationIdentifier
		}
	}

	/**
	 * Generates an injector definition for the injection of a module
	 * @param {string} moduleIdentifier The module identifier
	 * @return {{type: string, tree: string, module: string, moduleIdentifier: string}}
	 */
	getModuleInjector(moduleIdentifier) {
		let tree = '';
		if (moduleIdentifier.indexOf(':') > 0) {
			tree = moduleIdentifier.substring(moduleIdentifier.indexOf(':') + 1);
		}
		let moduleName = moduleIdentifier.indexOf(':') > 0 ? moduleIdentifier.substring(0, moduleIdentifier.indexOf(':')) : moduleIdentifier;
		return {
			type: 'module',
			tree,
			module: moduleName,
			moduleIdentifier: moduleName + ":" + tree
		};
	}

	/**
	 * Will resolve all instances and configurations needed to instantiate a module.
	 * @param {Array} injectors The injector definitions to resolve
	 * @param {string} root The tree to request the injectable parameters from
	 * @param {string} requestId The unique requestId to discover circular dependencies
	 * @return {*|{}|Uint8Array|any[]|Int32Array|Uint16Array}
	 */
	getModuleParams(injectors, root, requestId) {
		return injectors.map(injector => {
			switch (injector.type) {
				case 'module':
					return this.requestInstanceOfModule(injector.module, injector.tree || root, requestId);
				case 'config':
					return this.configResolver.getConfig(injector.root, injector.path);
			}
		});
	}

	/**
	 * Registers a new Instantiator
	 * @param {string} name The id which this instantiator is used with.
	 * @param {AbstractInstantiator} instantiator An instance of the instantiator
	 */
	registerInstantiator(name, instantiator) {
		this.instantiators[name] = instantiator;
	}

	/**
	 * @param {String} name The Name of the instantiator
	 * @return {AbstractInstantiator}
	 */
	getInstantiator(name) {
		if (!this.instantiators[name]) {
			throw new Error('No instantiator with the identifier "' + name + '" found in ' + JSON.stringify(Object.keys(this.instantiators)));
		}
		return this.instantiators[name];
	}

	/**
	 * Adds a new dependency tree to the stack
	 * @param {string} root The name of the tree
	 */
	addDependencyTree(root) {
		if (this.trees[root]) {
			throw new Error('Tree with root "' + root + '" already exists');
		}
		this.trees[root] = new DependencyTree(this, this.moduleResolver, root);
	}

	/**
	 * Returns the injection configuration of a module
	 * @param {String} moduleName The name of the module
	 * @return {InjectionConfiguration}
	 */
	getInjectionConfiguration(moduleName) {
		return this.moduleResolver.getResolvedModules().moduleMap[moduleName];
	}

	/**
	 * Connect another object manager to this instance. Local
	 * resolvable modules will have precedence before modules
	 * of additional object managers.
	 * @param {ObjectManager} objectManager The object manager to connect
	 */
	connectObjectManager(objectManager) {
		if (this.connectedObjectManagers.indexOf(objectManager) < 0) {
			this.connectedObjectManagers.push(objectManager);
		}
	}

	/**
	 * Get the object manager which can create an instance of the module.
	 * If no available object manager including this instance can resolve the
	 * module, nothing is returned.
	 * @param {string} moduleName
	 * @return {ObjectManager}
	 */
	getContainingObjectManager(moduleName) {
		if (this.moduleResolver.getResolvedModules().moduleMap[moduleName]) {
			return this;
		}
		for (let i = 0; i < this.connectedObjectManagers.length; i++) {
			if (this.connectedObjectManagers[i].getContainingObjectManager(moduleName)) {
				return this.connectedObjectManagers[i];
			}
		}
	}

}

module.exports = ObjectManager;