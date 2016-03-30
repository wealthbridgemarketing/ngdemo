/**
 * Inteleview Analytics - sandbox application
 * 
 * The purpose of this application is to:
 * 1. Learn how to create a single-page application using AngularJS and Bootstrap.
 * 2. Create/test components and snippets that will be used in the real application.
 * 3. Aid in the process of mastering AngularJS and Bootstrap.
 * 4. Break my dependency on jQuery by learning how to program without it.
 * 
 * Grunt is being used to build this application.
 */
var coreApp = angular.module('app.core', ['LocalStorageModule']);
var baseApp = angular.module('app.main', ['app.core']);
var siteApp = angular.module('app.site', ['ui.router',      // AngularUI Router - Replacement for ngRoute (https://github.com/angular-ui/ui-router)
                                          'door3.css',      // AngularCSS: Dynamically inject stylesheets as needed (https://github.com/castillo-io/angular-css)
                                          'ui.bootstrap',   // UI Bootstrap: Bootstrap components written in AngularJS (http://angular-ui.github.io/bootstrap)
                                          'app.core',
                                          'app.main']);
// CORE APP CONSTANTS
coreApp.constant('CFG', {
    DS            : '/',
    APP_TITLE     : 'Inteleview Analytics',
    APP_ROOT      : '/ngdemo/dist/', // relative to the web server sites directory (/var/www)
    LS_TYPE       : 'localStorage',  // localStorage or sessionStorage
    LS_PREFIX     : 'ngd',           // unique code appended to localStorage data
    API_BASE_PATH : 'http://localhost/inteleview/analytics/backend/api',
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

// PAGE TITLE - set using data.title of current state in ui-router
siteApp.run(['$rootScope', 'CFG', function($rootScope, CFG) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        var b = CFG.APP_TITLE,
            p = toState.data.title,
            t = b;
        if (p!==undefined && p!=='') t = p+' | '+b;
        $rootScope.$emit('SiteCtrl.setPageTitle', [t]);
    });
}]);
