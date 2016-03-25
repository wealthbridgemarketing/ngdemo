/* global coreApp */

// APP CONFIGURATION
coreApp.config(function (appConfig, localStorageServiceProvider) {
    var base = appConfig.basePath,
        host = window.location.hostname;
    
    // makes it possible to run x-debug on localhost
    if (/^localhost:(\d{3,6})$/.test(host)) { base = host.replace(/^localhost/, '') + base; }
    
    /**
     * dynamically add the base tag to the document head
     * required by $locationProvider.html5Mode(true); set in app.routes.js for ui-router
     */
    angular.element(document.querySelector('head')).append('<base href="' + base + '">');

    // configure the local storage service
    localStorageServiceProvider.setStorageType(appConfig.lsType);
    localStorageServiceProvider.setPrefix(appConfig.lsPrefix);
});

// DATA SERVICE
coreApp.factory('DataSrvc', ['appConfig', 'localStorageService', function (appConfig,localStorageService) {
    /**
     * Local Storage Service
     * @link https://github.com/grevory/angular-local-storage
     *
     * The lsExtender class extends the localStorageService by adding variable expiration.
     *
     * When you .get() an expired variable, it's automatically deleted and undefined is returned.
     */
    var lsExtender = new function () {
        /**
         * Set local storage var with optional expiration period
         *
         * @example
         * MainSrvc.locStorage.set('myTemplate', tmplHtml);
         * MainSrvc.locStorage.set('myUniqueKey', myVar, '1 day');
         *
         * @param {string} key
         * @param {(string|number|boolean|date|object)} val
         * @param {(string|null)=} exp - time period to add, ie: '1min' '5d' '1 year'
         */
        this.set = function (key, val, exp) {
            // variable expiration
            if (exp === undefined) exp = null;
            else {
                var parts  = exp.match(/^(\d+)(?:\s)?(\w+)$/),
                    num    = parseInt(parts[1]),
                    period = parts[2];
                
                exp = new Date().calcDiff(period, '+', num).getString();
            }
            
            // variable type
            var type = typeofObject(val);
            
            // convert non-string val to a string
            switch (type) {
                case 'date'   : val = val.getString();     break;
                case 'object' : val = JSON.stringify(val); break;
                case 'boolean':
                case 'number' : val = val.toString();      break;
            }

            // create storage string
            val = JSON.stringify({val: val, type: type, exp: exp});
            
            // store value
            localStorageService.set(key, val);
        };

        /**
         * Get local storage variable stored with set() method above
         *
         * @param {string} key
         *
         * @returns {*} value of variable stored as key or undefined
         */
        this.get = function (key) {
            // get variable from storage
            var str = localStorageService.get(key);
            if (str === null) return undefined;

            // convert stored value to an object
            var obj = JSON.parse(str);

            // check expiration
            if (obj.exp !== null) {
                if (new Date().fromString(obj.exp) < new Date()) {
                    localStorageService.remove(key);
                    return undefined;
                }
            }

            // convert non-string val back to its original type
            var val;
            switch (obj.type) {
                case 'date'   : val = new Date().fromString(obj.val); break;
                case 'object' : val = JSON.parse(obj.val);            break;
                case 'boolean': val = Boolean(obj.val);               break;
                case 'number' : val = Number(obj.val);                break;
                default:        val = obj.val;
            }

            return val;
        };
    };
    var locStorage = {
        'set'     : lsExtender.set,
        'get'     : lsExtender.get,
        'bind'    : localStorageService.bind,
        'remove'  : localStorageService.remove,
        'clearAll': localStorageService.clearAll
    };

    // This is where the apps data is all managed
    var appData = {},
        clsData = {
            save  : function(key,val) { appData[key] = val;               },
            merge : function(key,val) { angular.merge(appData[key], val); },
            remove: function(key)     { delete appData[key];              }
    };

    // define what this service offers
    var service = {
        'AppReadyState': false,
        'locStorage'   : locStorage,
        'ngPatterns'   : appConfig.ngPatterns,
        'AppData'      : appData,
        'AppDataClass' : clsData
    };

    return service;
}]);
