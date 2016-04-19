/* global coreApp */

/**
 * Data Service
 */
coreApp.factory('DataSrvc', ['CFG', 'localStorageService', function (CFG, localStorageService) {
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
         * BaseSrvc.locStorage.set('myTemplate', tmplHtml);
         * BaseSrvc.locStorage.set('myUniqueKey', myVar, '1 day');
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

    /**
     * Application Data Model
     * @type {{}}
     */
    var appData = {},
        clsData = {
            save  : function(key,val) {
                if (/\./.test(key)===false) appData[key] = val;
                else {
                    var obj = "['"+ key.replace(/\./,"']['") +"']";
                        type = typeofObject(val);
                    switch (type) {
                        case 'string': val = '"' + val + '"'; break;
                        case 'object': val = '{' + val + '}'; break;
                        case 'null'  : val = null;            break;
                        default      : val = val;             break;
                    }
                    eval('appData'+obj+' = '+val);
                }
            },
            merge : function(key,val) { angular.extend(appData[key], val); },
            remove: function(key)     { delete appData[key];              }
    };

    // define what this service offers
    var service = {
        'AppReadyState': false,
        'locStorage'   : locStorage,
        'regxPatterns' : CFG.REGX_PATTERNS,
        'AppData'      : appData,
        'AppDataClass' : clsData,
        'AppTitle'     : CFG.APP_TITLE
    };

    return service;
}]);
