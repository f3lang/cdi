# CDI

Cool Dependency Injection  
A lightweight, powerful and very easy to use dependency injection framework.  
Support singleton, prototype and custom scopes, configuration injection and handling of 
multiple instances of modules. 
## simple example with module and configuration injection
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
const ObjectManager = require('cdi').objectManager;

const bikeConfig = {
    wheels: {
        size: 26
    }
};

let objectManager = new ObjectManager({
    moduleSrc: [path.join(__dirname, 'src')],
    cacheFile: path.join(__dirname, 'cache', 'cdi.json'),
    configurations: {
        bike: bikeConfig
    }
});

let myBike = objectManager.getInstance('Bike');
// now you got your bike with injected wheels, which got the size information injected
```
ready for more?
## more complex example with active usage of dependency trees
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
const ObjectManager = require('cdi').objectManager;

const bikeConfig = {
    wheels: {
        size: 26
    }
};

let objectManager = new ObjectManager({
    moduleSrc: [path.join(__dirname, 'src')],
    cacheFile: path.join(__dirname, 'cache', 'cdi.json'),
    configurations: {
        bike: bikeConfig
    }
});

let myBike = objectManager.getInstance('Bike');
// now you got your bike with two injected wheels, which got the size information injected 
// and share one common speed instance
```

## Documentation
I don't want to just copy paste documentation. So best head over to [https://f3lang.github.io/cdi](https://f3lang.github.io/cdi)

## Contribute
You want to make the world a better place and want to start with this module? awesome :D  
Please read the contribution guidelines to get started and i'm looking forward to new stuff.