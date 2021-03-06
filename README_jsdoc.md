# CDI

[![Build Status](https://travis-ci.org/f3lang/cdi.svg?branch=master)](https://travis-ci.org/f3lang/cdi) 
[![Coverage Status](https://coveralls.io/repos/github/f3lang/cdi/badge.svg?branch=master)](https://coveralls.io/github/f3lang/cdi?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/6b1a2292df6234fe0d1c/maintainability)](https://codeclimate.com/github/f3lang/cdi/maintainability)
[![Package Quality](http://npm.packagequality.com/shield/cdi.svg)](http://packagequality.com/#?package=cdi)


Cool Dependency Injection  
A lightweight, powerful and very easy to use dependency injection framework.  
Support singleton, prototype and custom scopes, configuration injection and handling of 
multiple instances of modules. 
## Usage
```bash
npm install --save cdi
```
and code:
```js
let path = require('path');
let CDI = require('cdi');
let cdi = new cdi({
    moduleSrc: [path.join(__dirname, 'src')]
});
let myMainModule = cdi.getInstance('MainModule');
myMainModule.nowDoMyStuff();

// as i promised, simple as hell :D
```

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

## Documentation
So you're still on it? :) great!! A good start is {@tutorial options}

## Contribute
You want to make the world a better place and want to start with this module? awesome :D  
Please read the contribution guidelines to get started and i'm looking forward to new stuff.