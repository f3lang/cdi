### module injection definition
To let cdi resolve dependencies and inject them into your module, you need to tell it, what your module needs.

#### constructor injection
This is the default way to use cdi in es6 based modules. You define additional properties 
for your module, that will be analyzed by cdi:

```js
class Bananarama {
	
	constructor(classInstance, configuration) {
		this.myGreatClassInstance = classInstance;
		this.configuration = configuration;
	}
	
}

module.exports = Bananarama;
module.exports.inject = ['Apple', 'config:fruit:prod.bananaconf'];
module.exports.scope = 'singleton';
module.exports.alias = ['MyCoolModule', 'AnotherCoolName']
```
The *inject* property tells cdi what to inject. For further information how to define injects look at {@tutorial injection}  
The *scope* tells cdi how to handle instances of your module. Right now you have two options available:  

- singleton
- prototype

singleton will create one instance of the module per dependency tree. prototype will always create a new instance of 
your module, when it is requested. You can also write your own instantiation logic. Please have a look at {@tutorial instantiator}

alias defines an array of alias names, your module should be resolvable under. In the upper example, the module
may also be referenced by the name **MyCoolModule** and **AnotherCoolName**. Be careful, this might clash with other module
names, if you used the name already.

A few names are reserved by cdi and shouldn't be used:

- ObjectManager
- DependencyTree
- ConfigResolver
- ModuleAnalyzer
- ModuleResolver 

All of those definitions are optional. You may also leave them out completely. Then your module will be handled
as a module with a constructor without parameters and a singleton.