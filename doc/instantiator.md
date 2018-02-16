Instantiators are the classes that effectively do the instantiation of your module. 
cdi comes right now with two instantiators included, but you may build your own if you want.
(e.g. you could create a wrapper around an API and inject it) It is up to you what you want 
to build.

### singleton
The singleton instantiator will create a maximum of one instance per dependency tree. When you request 
the module again inside the same dependency tree, you will get the very same instance as before.

### prototype
The prototype instantiator will always create a new instance of a module.

### custom
If you want to build your own instantiator, best have a look at {@link Prototype}, because this is 
a very simple example how to build an instantiator.
After you build your instantiator, you can register it in the objectmanager to make it available:
```js
let instantiator = new CustomInstantiator();
objectManager.registerInstantiator('customKeyword', instantiator);
```
And there we go, now you can create instances with you own instantiator and build whatever you want.
Just set the scope of your modules, you want to instantiate with your custom instantiator, to your
custom keyword.