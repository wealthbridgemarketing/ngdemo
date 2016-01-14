/* global coreApp */

// APP CONSTANTS
coreApp.constant('appConfig', {
  baseTitle : 'Inteleview Analytics',
  basePath  : '/ngdemo/dist/',
  restPath  : '',
  lsType    : 'localStorage', // localStorage or sessionStorage
  lsPrefix  : 'ngdemo'
});

// APP CONFIGURATION
coreApp.config(function (appConfig, localStorageServiceProvider) {
  // this makes it possible to run x-debug on localhost
  var base = appConfig.basePath,
      host = window.location.hostname;
  if (/^localhost:(\d{3,6})$/.test(host)) {
    base = host.replace(/^localhost/,'') + base;
  }
  // dynamically add the base tag to the document head
  // required by $locationProvider.html5Mode(true); set in app.routes.js for ui-router
  angular.element(document.querySelector('head')).append('<base href="'+base+'">');

  // configure the local storage service
  localStorageServiceProvider.setStorageType( appConfig.lsType );
  localStorageServiceProvider.setPrefix( appConfig.lsPrefix );

});

// DATA SERVICE
coreApp.factory('DataService', ['$log', 'localStorageService', function($log, localStorageService)
{
  // provides easy access to angulars $log method
  var log = function(msg,type) {
    var method;
    switch (type) {
      case 'd': method = 'debug'; break;
      case 'e': method = 'error'; break;
      case 'i': method = 'info';  break;
      case 'w': method = 'warn';  break;
      default:  method = 'log';
    }
    $log[method](msg);
  };

  /**
   * Local Storage Service
   * @link https://github.com/grevory/angular-local-storage
   *
   * The lsExtender class extends the localStorageService by adding variable expiration.
   * When you .get() an expired variable, it's removed and undefined is returned, as if it wasn't set.
   * See the comments on the getExpiryDate() function for details on how to define the expiration period.
   */
  var lsExtender = new function() {
    
    this.set = function(key, val, exp)
    {
      exp = typeof exp === 'undefined' ? null : getExpiryDate(exp);
      var type = typeof val;
      if (type==='object' && val!==null) { val = JSON.stringify(val); }
      val = JSON.stringify({ val: val, type: type, exp: exp });
      localStorageService.set(key, val);
    };
    
    this.get = function(key)
    {
      var str = localStorageService.get(key);
      if (str===null) return undefined;
      
      var obj = JSON.parse(str);
      if (typeof obj.exp === 'undefined') obj.exp = null;
      
      // check expiration
      if (obj.exp !== null) {
        if (new Date(obj.exp) < new Date()) {
          //log('DataService:locStorage: Key "'+key+'" has expired');
          localStorageService.remove(key);
          return undefined;
        }
      }
      
      return obj.type==='object' ? JSON.parse(obj.val) : obj.val;
    };
    
    /**
     * Add a period of time to the current 
     * date using a human readable string.
     * 
     * Allowed Periods:
     *  s | sec | second | seconds
     *  min | minute | minutes 
     *  h | hour | hours
     *  d | day | days
     *  mon | month | months
     *  y | year | years
     * 
     * Examples:
     * var expDate = getExpiryDate('1d').toJSON();
     * var expDate = getExpiryDate('2 hours');
     * 
     * @param {str} period
     * @returns {date object}
     */
    function getExpiryDate (period) {
      var seconds = ['s', 'sec', 'second', 'seconds'],
          minutes = ['min', 'minute', 'minutes'],
          hours   = ['h', 'hour', 'hours'],
          days    = ['d', 'day', 'days'],
          months  = ['mon', 'month', 'months'],
          years   = ['y', 'year', 'years'],

          parts = period.match(/^(\d+)(?:\s)?(\w+)$/),
          num = parseInt(parts[1]),
          str = parts[2],

          dat = new Date();

           if (seconds.indexOf( str ) !== -1) dat.setSeconds(dat.getSeconds()   + num);
      else if (minutes.indexOf( str ) !== -1) dat.setMinutes(dat.getMinutes()   + num);
      else if (  hours.indexOf( str ) !== -1) dat.setHours(dat.getHours()       + num);
      else if (   days.indexOf( str ) !== -1) dat.setDate(dat.getDate()         + num);
      else if ( months.indexOf( str ) !== -1) dat.setMonth(dat.getMonth()       + num);
      else if (  years.indexOf( str ) !== -1) dat.setFullYear(dat.getFullYear() + num);

      return dat;
    };
    
  };
  
  var locStorage = {
    'set': lsExtender.set,
    'get': lsExtender.get,
    'bind': localStorageService.bind,
    'remove': localStorageService.remove,
    'clearAll': localStorageService.clearAll
  };
  
  // regex patterns to use with ng-pattern
  function getPattern() { return pattern; }
  var pattern = {
    email: /^([a-z0-9_\-\.]+)[@]([a-z0-9_\-\.]{2,99})[.]([a-z0-9]{2,20})+$/gmi,
    numeric: /^(\d+)$/gm,
    date: /^(0?[1-9]|1[012])[- \/.](0?[1-9]|[12][0-9]|3[01])[- \/.](19|20)?([0-9]{2})$/gm,
    phone: { 
      us: /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/gm 
    },
    ssn: /^(\d{3})[-.\s]?(\d{2})[-.\s]?(\d{4})$/gm,
    url: /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi,
    postal: { 
      us: /^(?:(\d{4})(?:[-. ]{1}))?(\d{5})$/gm 
    }
  };

  // define what this service offers
  var service = {
    'LssReadyState' : true,
    'AppReadyState' : false,
    'log'           : log,
    'locStorage'    : locStorage,
    'getPattern'    : getPattern
  };
  
  return service;
}]);
