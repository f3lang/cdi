/**
 * Abstract class of all instantiator implementations. An Instantiator will create an instance of a module.
 * You cannot be sure, you get an actual instance of the object, since it could be possible to implement the module
 * as e.g. rpc module which wraps an API.
 * It will keep track of instances to react to circular dependencies.
 *
 * @author Wolfgang Felbermeier (@f3lang)
 */
class AbstractInstantiator {

	constructor() {
		this.requestCollection = [];
	}

	/**
	 * Will create a new instance of the requested module
	 * @param {string} path The file path of the module
	 * @param {object} config The injection config resolved by the module analyzer
	 * @param {string} root The tree to work in
	 * @param {string} requestId The unique request id to identify circular dependencies
	 */
	getInstance(path, config, root, requestId) {
		throw Error('This is an abstract class, use a derived class instead');
	}

	/**
	 * Will check, if the current request has already visited this stage once.
	 * @param {string} path The file path of the module
	 * @param {string} root The tree to work in
	 * @param {string} requestId The unique request id to identify circular dependencies
	 * @return {boolean} true, if a circular dependency occurred.
	 */
	requestIsCircular(path, root, requestId) {
		if(this.requestCollection.indexOf(requestId  + ':' +  path + ':' + root) > -1) {
			console.warn("Warning: circular dependency detected for " + requestId  + ':' +  path + ':' + root);
			return true;
		}
		this.requestCollection.push(requestId  + ':' +  path + ':' + root);
	}
}

module.exports = AbstractInstantiator;
module.exports.inject = [];