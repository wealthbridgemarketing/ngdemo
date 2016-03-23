/* global coreApp */

// APP CONSTANTS
coreApp.constant('appConfig', {
    baseTitle: 'Inteleview Analytics',
    basePath : '/ngdemo/dist/',
    restPath : '',
    lsType   : 'localStorage', // localStorage or sessionStorage
    lsPrefix : 'ngdemo'
});

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
coreApp.factory('DataSrvc', ['localStorageService', function (localStorageService) {
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
         * DashboardSrvc.locStorage.set('myTemplate', tmplHtml);
         * DashboardSrvc.locStorage.set('myUniqueKey', myVar, '1 day');
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

    // regex patterns to use with ng-pattern
    function getPattern() {
        return pattern;
    }

    var pattern = {
        email  : /^([a-z0-9_\-\.]+)[@]([a-z0-9_\-\.]{2,99})[.]([a-z0-9]{2,20})+$/gmi,
        numeric: /^(\d+)$/gm,
        date   : /^(0?[1-9]|1[012])[- \/.](0?[1-9]|[12][0-9]|3[01])[- \/.](19|20)?([0-9]{2})$/gm,
        phone  : {
            us: /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/gm
        },
        ssn    : /^(\d{3})[-.\s]?(\d{2})[-.\s]?(\d{4})$/gm,
        url    : /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi,
        postal : {
            us: /^(?:(\d{4})(?:[-. ]{1}))?(\d{5})$/gm
        }
    };

    // define what this service offers
    var service = {
        'LssReadyState': true,
        'AppReadyState': false,
        'locStorage'   : locStorage,
        'getPattern'   : getPattern
    };

    return service;
}]);
