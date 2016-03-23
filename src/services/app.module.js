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
//===================================================================================================
//=  BASE.APPLICATION  ==============================================================================
//===================================================================================================
var baseApp = angular.module('AnalyticsApp', ['ui.router',      // AngularUI Router - Replacement for ngRoute (https://github.com/angular-ui/ui-router)
                                              'door3.css',      // AngularCSS: Dynamically inject stylesheets as needed (https://github.com/castillo-io/angular-css)
                                              'ui.bootstrap',   // UI Bootstrap: Bootstrap components written in AngularJS (http://angular-ui.github.io/bootstrap)
                                              'app.core',
                                              'app.services']);
  
baseApp.controller('AppCtrl', ['$scope', '$rootScope', 'Breadcrumbs', 'DashboardSrvc', function($scope, $rootScope, Breadcrumbs, DashboardSrvc)
{
    // page title
    $rootScope.$on('AppCtrl.setPageTitle', function(event, title) {
        $scope.pageTitle = title;
    });

    // Dashboard Service
    $scope.dash = DashboardSrvc;
    var log = $scope.dash.log;

    // breadcrumbs
    $scope.breadcrumbs = false;
    $scope.$watch(function() { return Breadcrumbs.get(); }, function(newVal) {
        $scope.breadcrumbs = newVal;
    }, true);

    // FilterSrvc testing
    $scope.counter = 0;
    $scope.increment = function() {
        $scope.counter++;
    };

}]);

// page title set using data.title of current state in ui-router
baseApp.run(['$rootScope', 'appConfig', function($rootScope, appConfig) {
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    var b = appConfig.baseTitle,
        p = toState.data.title,
        t = b;
    if (p!==undefined && p!=='') t = p+' | '+b;
    $rootScope.$emit('AppCtrl.setPageTitle', [t]);
  });
}]);

//===================================================================================================
//=  ADDITIONAL APPLICATIONS - Created here for use with Grunt  =====================================
//===================================================================================================
var coreApp = angular.module('app.core', ['LocalStorageModule']);
var dashApp = angular.module('app.services', ['app.core','app.utils']);
var utilApp = angular.module('app.utils', ['app.core']);