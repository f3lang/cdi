cdi takes an object as options upon initialization. The default structure looks like this:
```js
let options = {
                    moduleSrc: [],
                    cacheFile: null,
                    configurations: {},
                    globalScope: false
              };
let cdi = new cdi(options);
```
#### moduleSrc
moduleSrc defines an Array of absolute filepaths to use in cdi. All classes in the filepaths will be parsed
recursively and are resolvable through cdi.

#### cacheFile
Short: cdi may use a json cachefile to store resolved modules and their configuration. Entries will be
updated and refreshed, when the sourcefile of a class was modified. For smaller setups you won't feel that
much performance improvement, but for larger projects this will have a huge impact on startup performance.
for more details head over to {@tutorial cache}

#### configurations
cdi supports configuration injection (see {@tutorial injection} for details). You can add as many
configurations as you want. The key in this object will be used as a root identifier in the injection
syntax. e.g.:

```js
let bikeConfig = {
	wheels: 2,
	size: 26,
	speed: 'unlimited'
};
let options = {
	configurations: {
		bike: bikeConfig 
	}
};
let cdi = new cdi(options);
``` 
Now your bike configuration is available for injection with the identifier **config:bike:**

#### globalScope
For details, how the global scope works and why you should not need to use it, visit {@tutorial global_scope}
