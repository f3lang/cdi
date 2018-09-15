### Connect other object managers
You can connect other object managers to an existing one:
```js
let cdi1 = new CDI({});
let cdi2 = new CDI({});
cdi.connectObjectManager(cdi1);

// now you can resolve modules from cdi2 through cdi1:
let instance = cdi1.getInstance('ClassNameOnlyExistingInCDI2');
``` 
You can connect as many object managers as you want to an existing object manager. The first Object 
Manager which is able to instantiate an object will be responsible to do so. If a connected Object Manager
is able to instantiate a module with the same identifier as the origin object manager 
(in the upper example cdi1), the origin object manager has precedence over the connected object managers.
So to come back to the upper example, if you request an instance of a module resolvable by both of the 
object managers and you request the instance from **cdi1**, the instance of cdi1 will be returned.