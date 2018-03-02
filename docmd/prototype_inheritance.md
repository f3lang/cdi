When you code extensively in es6 you will sooner or later start to use prototype inheritance. This is
a really cool feature and helps to keep your code clean.

So somewhere you will have something in your code, that looks like this:

```js
class Wheels {
	constructor() {
		this.numberOfWheels = 2;
	}
}
module.exports = Wheels;

class Vehicle {
	constructor(wheels) {
		this.wheels = wheels;
	}
}
module.exports = Vehicle;
module.exports.inject = ['Wheels'];

class Bike extends Vehicle {
	constructor() {
		super();
	}
}
module.exports = Bike;

let bike = cdi.getInstance('Bike');
```

So far, it looks quite nice. But in terms of dependendency injection this construct is a bit tricky. You
don't request the parent classes but the target class 'Bike', which has it's own injection definitions.
Since js is a prototype based language, the injection definition is overwritten by the bike class. 

So you need to support this somehow. CDI does. When the prototype is instantiated, cdi walks up the
prototype tree and wraps proxy prototypes around them, which will handle the injection. After the
instantiation, the prototype tree is rewritten to its original state, so you don't see any differences.

The parent prototype will not interfere with direct instantiations of the parent prototype. In the
upper example you could still instantiate an Object Vehicle which would be an entirely different object
than Bike. The injection and resolution of the inject properties will only work in the corresponding 
scope of the prototype, which defined the injection property. So for the upper example this means, that
you cannot override the **Wheels** injection of Vehicle with an injection definition in Bike 
(e.g. **Wheels:root**).

But there is another cool thing you can do: You can still hand over arguments to the parent prototype.
They will be a appended to the injected propertied. So if you want to do this, you can do something like
this:

 
```js
class Wheels {
	constructor() {
		this.numberOfWheels = 2;
	}
}
module.exports = Wheels;

class Vehicle {
	constructor(wheels, sizeOfWheels) {
		// will be injected by cdi
		this.wheels = wheels;
		// your parameter you hand over on instantiation
		this.sizeOfWheels = sizeOfWheels;
	}
}
module.exports = Vehicle;
module.exports.inject = ['Wheels'];

class Bike extends Vehicle {
	constructor() {
		super(26);
	}
}
module.exports = Bike;

let bike = cdi.getInstance('Bike');
// now your bike has a wheel size of 26
```