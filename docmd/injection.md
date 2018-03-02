### injection definition
In your module you must set the ``exports.inject`` property. This property should be an array and includes
the definition of the properties, that should be used to instantiate your module. The number of properties 
to inject should match the number of parameters in the constructor of your module. If you define less then
the number of parameters, the overflowing parameters will be null.  
You can define two different types of injections:

#### module dependency
A module dependency has the form ``moduleName:treeName`` whereas moduleName may be either the name of
your module or an alias of your module as defined in {@tutorial module_structure} and treeName the name
if the {@tutorial dependency_trees}. You can omit the treeName and should to this in most cases, since
you need to override only in very complex environments. When you set the treeName, you will always get
an instance out of this tree no matter in which tree the instance of your module resides. If not set,
you will get an instance of the injected module which resides in the same dependency tree as your 
current module instance.

#### configuration dependency
The second option you can inject as a parameter are configuration values. To add configurations you
can just add then to the object manager:
```js
let configuration = {
	fruit: {
		banana: {
			manaRegeneration: 500
		}
	}
};
cdi.addConfiguration(configuration, "health");

// or on initialization:
let cdi = new CDI({
	configurations: {
		health: configuration 
	}
});
```
With the upper example you can now inject the configuration of the name "health" as an injection
configuration. The syntax is ``config:configurationName:configuration.path``. So as an example to inject
the mana Regeneration of a banana from the upper example your injection definition would be 
``config:health:fruit.banana.manaRegeneration``. When you omit the configuration path 
(like this: ``config:health:``) then the complete configuration ``health`` is injected.

### example
So lets look at it in action:
src/wheels.js:
```js
class Wheels {
    constructor(size) {
        this.size = size;
    }
}
module.exports = Wheels;
module.exports.inject = ['config:bike:wheels.size'];
```
src/bike.js:
```js
class Bike {
    constructor(wheels) {
        this.wheels = wheels;
    }
}
module.exports = Bike;
module.exports.inject = ['Wheels'];
```
main.js:
```js
const path = require('path');
const CDI = require('cdi');

const bikeConfig = {
    wheels: {
        size: 26
    }
};

let cdi = new CDI({
    moduleSrc: [path.join(__dirname, 'src')],
    cacheFile: path.join(__dirname, 'cache', 'cdi.json'),
    configurations: {
        bike: bikeConfig
    }
});

let myBike = cdi.getInstance('Bike');
// now you got your bike with injected wheels, which got the size information injected
```



### circular dependency
circular depencencies will issue a warning in the console and the injected argument will be null.

### prototype inheritance
cdi can work with prototype inheritance and will also resolve dependencies in parent prototypes.
For more details visit {@tutorial prototype_inheritance}
