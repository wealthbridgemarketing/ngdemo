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
var mainApp = angular.module('app.main', ['app.core']);
var siteApp = angular.module('AnalyticsApp', ['ui.router',      // AngularUI Router - Replacement for ngRoute (https://github.com/angular-ui/ui-router)
                                              'door3.css',      // AngularCSS: Dynamically inject stylesheets as needed (https://github.com/castillo-io/angular-css)
                                              'ui.bootstrap',   // UI Bootstrap: Bootstrap components written in AngularJS (http://angular-ui.github.io/bootstrap)
                                              'app.core',
                                              'app.main']);

// APP CONSTANTS
coreApp.constant('appConfig', {
    baseTitle : 'Inteleview Analytics',
    basePath  : '/ngdemo/dist/',
    restPath  : '',
    lsType    : 'localStorage', // localStorage or sessionStorage
    lsPrefix  : 'ngdemo',
    ngPatterns: {
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

// PAGE TITLE - set using data.title of current state in ui-router
siteApp.run(['$rootScope', 'appConfig', function($rootScope, appConfig) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        var b = appConfig.baseTitle,
            p = toState.data.title,
            t = b;
        if (p!==undefined && p!=='') t = p+' | '+b;
        $rootScope.$emit('AppCtrl.setPageTitle', [t]);
    });
}]);
