The object manager has a option to use a json file as a module resolution cache. This helps to improve
speed in very large setups. But more importantly, it helps you to get an overview, what the injection
map in the background looks like. The file is formatted json and should be readable by anyone who knows, 
how json looks like.
 
#### example

```json
{
    "moduleMap": {
        "VeryCoolVehicle": {
            "path": "/home/cdi/test/src/testcase/Bike.js",
            "config": {
                "injectMap": [
                    {
                        "type": "module",
                        "tree": "root",
                        "module": "WheelConfiguration",
                        "moduleIdentifier": "WheelConfiguration:root"
                    },
                    {
                        "type": "module",
                        "tree": "root",
                        "module": "Route",
                        "moduleIdentifier": "Route:root"
                    }
                ],
                "scope": [
                    "singleton"
                ]
            },
            "name": "VeryCoolVehicle",
            "originModuleName": "Bike"
        },
        "Bike": {
            "path": "/home/cdi/test/src/testcase/Bike.js",
            "config": {
                "injectMap": [
                    {
                        "type": "module",
                        "tree": "root",
                        "module": "WheelConfiguration",
                        "moduleIdentifier": "WheelConfiguration:root"
                    },
                    {
                        "type": "module",
                        "tree": "root",
                        "module": "Route",
                        "moduleIdentifier": "Route:root"
                    }
                ],
                "scope": [
                    "singleton"
                ]
            },
            "name": "Bike",
            "originModuleName": "Bike"
        },
        "WheelConfiguration": {
            "path": "/home/cdi/test/src/testcase/WheelConfiguration.js",
            "config": {
                "injectMap": [],
                "scope": [
                    "singleton"
                ]
            },
            "name": "WheelConfiguration",
            "originModuleName": "WheelConfiguration"
        },
        "Route": {
            "path": "/home/cdi/test/src/testcase/Route.js",
            "config": {
                "injectMap": [],
                "scope": [
                    "prototype"
                ]
            },
            "name": "Route",
            "originModuleName": "Route"
        },
        "BikeWithConfig": {
            "path": "/home/cdi/test/src/testcase/BikeWithConfig.js",
            "config": {
                "injectMap": [
                    {
                        "type": "config",
                        "path": "fruit.name",
                        "root": "test",
                        "identifier": "config:test:fruit.name"
                    }
                ],
                "scope": "singleton"
            },
            "name": "BikeWithConfig",
            "originModuleName": "BikeWithConfig"
        }
    },
    "fileCache": {
        "Bike.js": {
            "mtimeMs": 1518713539690.4202
        },
        "WheelConfiguration.js": {
            "mtimeMs": 1518713346930.764
        },
        "Route.js": {
            "mtimeMs": 1518713478014.5293
        },
        "BikeWithConfig.js": {
            "mtimeMs": 1518779330958.8516
        }
    }
}
```