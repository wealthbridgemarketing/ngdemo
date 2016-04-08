/**
 * Inteleview Analytics - sandbox application
 * 
 * @todo Update Breadcrumbs class to become a theme class
 * @suppress Fix the Template demo
 * @suppress Fix the 404 demo
 * @todo Finish the AuthSrvc
 * @todo Finish the HttpSrvc
 * @todo Can a Node server be spun up automatically?
 * @todo How can the DataSrvc automatically use local storage?
 * @todo Update theme to be traditional Bootstrap App
 * @todo Add generic modal to uiSrvc
 * @todo Add generic Alert modal to uiSrvc
 * @todo Create page to demo uiSrvc services
 * @todo Complete the Contact Page
 * @todo Complete the Profile Page
 * @todo Add a Login Form
 * @todo Demo Angular Animation
 * @todo Add new Sass Mixins
 * @todo Add Highcharts Demo
 * @todo Add Global DevMode to uiSrvc
 */
var coreApp = angular.module('coreApp', ['LocalStorageModule']);
var baseApp = angular.module('baseApp', ['coreApp']);
var siteApp = angular.module('siteApp', ['ui.router',     // AngularUI Router - Replacement for ngRoute (https://github.com/angular-ui/ui-router)
                                         'door3.css',     // AngularCSS: Dynamically inject stylesheets as needed (https://github.com/castillo-io/angular-css)
                                         'ui.bootstrap',  // UI Bootstrap: Bootstrap components written in AngularJS (http://angular-ui.github.io/bootstrap)
                                         'baseApp']);
// CORE APP CONSTANTS
coreApp.constant('CFG', {
    DS            : '/',
    APP_TITLE     : 'Inteleview Analytics',
    APP_ROOT      : '/ngdemo/dist/', // relative to the web server sites directory (/var/www)
    LS_TYPE       : 'localStorage',  // localStorage or sessionStorage
    LS_PREFIX     : 'ngd',           // unique code appended to localStorage data
    API_BASE_PATH : 'api/v1',        // abs or rel path to remote api server - no trailing slash
    REGX_PATTERNS : {
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
    }
});

// CORE APP CONFIGURATION
coreApp.config(function (CFG, localStorageServiceProvider) {
    var base = CFG.APP_ROOT,
        host = window.location.hostname;

    // makes it possible to run x-debug on localhost
    if (/^localhost:(\d{3,6})$/.test(host)) { base = host.replace(/^localhost/, '') + base; }

    /**
     * dynamically add the base tag to the document head
     * required by $locationProvider.html5Mode(true); set in app.routes.js for ui-router
     */
    angular.element(document.querySelector('head')).append('<base href="' + base + '">');

    // configure the local storage service
    localStorageServiceProvider.setStorageType(CFG.LS_TYPE);
    localStorageServiceProvider.setPrefix(CFG.LS_PREFIX);
});
