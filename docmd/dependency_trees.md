The module instances are organized in dependency trees. You can see a dependency tree as a set of instances
that logically belong together. The main tree always has the identifier **root**. 

Take a mongodb database as an example. You hav a connector class for a single
collection. But now you have multiple modules that require connection to different collections. Of course 
you now could start to connect to all of you needed collections in you collection connector. But wouldn't
it be easier to build this generic? This is what is possible with dependency trees. You just define the
injections in your, lets say controllers, with an identifier that matches the collection you need and your
connector will know about this (for a little example look below). The module will have the current tree 
available in the parameter ``module.exports.tree``. Now there is a little caveat. It is called
dependency tree for a reason. When a module is instantiated cdi will try to inject instances of that tree 
only if not advised differently. You can force this by setting the tree identifier in the inject definition of
the exports (see {@tutorial module_structure} for details).

### example
src/speed.js:
```js
class Speed {
	constructor() {
		this.speed = 0;
	}
	
	setSpeed(speed) {
		this.speed = speed;
	}
}
module.exports = Speed;
```
src/wheel.js:
```js
class Wheel {
    constructor(size, speed) {
        this.size = size;
        this.position = module.exports.tree;
        this.speed = speed;
    }
}
module.exports = Wheel;
module.exports.inject = ['config:bike:wheels.size', 'Speed:root'];
```
src/bike.js:
```js
class Bike {
    constructor(frontWheel, backWheel) {
        this.wheels = {frontWheel, backWheel};
    }
}
module.exports = Bike;
module.exports.inject = ['Wheel:front', 'Wheel:back'];
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
// now you got your bike with two injected wheels, which got the size information injected 
// and share one common speed instance
```