/* global siteApp */

// configure our routes
siteApp
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        // For any unmatched url
        $urlRouterProvider.otherwise('/404');

        // Application states
        $stateProvider
            .state('home', {
                url        : '/',
                templateUrl: 'sections/home/view.html',
                controller : 'HomeCtrl',
                data       : {title: 'Home'}
            })
            .state('analytics', {
                url        : '/',
                templateUrl: 'sections/analytics/view.html',
                controller : 'AnalyticsCtrl',
                data       : {title: 'Analytics'}
            })
            .state('contact', {
                url        : '/contact',
                templateUrl: 'sections/contact/view.html',
                controller : 'ContactCtrl',
                data       : {title: 'Contact Us'}
            })
            .state('profile', {
                url        : '/profile',
                templateUrl: 'sections/profile/view.html',
                controller : 'ProfileCtrl',
                data       : {title: 'Edit Profile'}
            })
            .state('templates', {
                url        : '/templates',
                templateUrl: 'sections/templates/view.html',
                css        : 'sections/templates/styles.min.css',
                controller : 'TemplatesCtrl',
                data       : {
                    title      : 'AngularJS Dynamic Templates',
                    ajaxBaseURI: 'sections/templates/consumables/',
                    imagePath  : 'sections/templates/images/'
                },
                resolve    : {
                    appContent  : function (LoadExternal) {
                        return LoadExternal.load(this.data.ajaxBaseURI + 'content.json', 'content', '10 sec');
                    },
                    appTemplates: function (LoadExternal) {
                        return LoadExternal.load(this.data.ajaxBaseURI + 'templates.json', 'templates', '5s');
                    }
                }
            })
            .state('transfer', {
                url        : '/transfer',
                templateUrl: 'sections/transfer/view.html',
                controller : 'XferCtrl',
                data       : {title: 'Cash Transfer'}
            })
            .state('login', {
                url        : '/login',
                templateUrl: 'sections/auth/login.html',
                controller : 'AuthCtrl',
                data       : {title: 'Login'}
            })
            .state('logout', {
                url        : '/logout',
                templateUrl: 'sections/auth/logout.html',
                controller : 'AuthCtrl',
                data       : {title: 'Logout'}
            })
            .state('signup', {
                url        : '/signup',
                templateUrl: 'sections/auth/signup.html',
                controller : 'AuthCtrl',
                data       : {title: 'Signup'}
            })
            .state('404', {
                url        : '/404',
                templateUrl: 'sections/404/404-view.html',
                css        : 'sections/404/404.min.css',
                controller : '404Ctrl',
                data       : {title: 'Page Not Found'}
            });

    })
    .run(['$rootScope', '$location', 'CFG', 'httpSrvc', function($rootScope, $location, CFG, httpSrvc) {

        // If the user isn't authenticated redirect to the login page
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            $rootScope.authenticated = false;
            httpSrvc.get('/session').then(function (results) {
                var data = results.data;
                if (data.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = data.uid;
                    $rootScope.name = data.name;
                    $rootScope.email = data.email;
                }
                else if (['/login','/signup'].indexOf(next.$$route.originalPath) === -1) {
                    $location.path('/login');
                }
            });
        });

        // PAGE TITLE - set using data.title of current state in ui-router
        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            var b = CFG.APP_TITLE,
                t = b,
                p = toState.data.title;
            if (!!p) t = p + ' | ' + b;
            $rootScope.$emit('PageTitleSet', [t]);
        });

    }]);