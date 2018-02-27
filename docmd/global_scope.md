The Object Manager has an option to session persistent in the global scope. This is useful, if you have 
different locations, which cannot be resolved properly by the object manager (e.g. abstract parent classes)

When you enable the option "globalScope" in the options on instantiating the objectmanager, the Objectmanager
will create an object _cdi in the global scope, which will be reused on other instantiations of the 
Objectmanager. 

Have in mind, that you should not rely on global vars, since it is a sign, 
that you could optimize your code. But cdi gives you this possibility, if you have no other way to go.   