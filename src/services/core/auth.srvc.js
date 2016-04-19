/* global coreApp, siteApp */

// AUTHENTICATION SERVICE
siteApp.controller('AuthCtrl', ['$scope', '$location', 'httpSrvc', 'Breadcrumbs', function ($scope, $location, httpSrvc, Breadcrumbs) {
    Breadcrumbs.set([
        { text: 'Login' }
    ]);

    //initially set those objects to null to avoid undefined error
    $scope.login  = {};
    $scope.signup = {email: '', password: '', name: '', phone: '', address: ''};

    $scope.doLogin = function(customer) {
        httpSrvc.post('login', {
            customer: customer
        }).then(function(results) {
            httpSrvc.toast(results);
            if (results.status == 'success') {
                $location.path('dashboard');
            }
        });
    };

    $scope.signUp = function(customer) {
        httpSrvc.post('signUp', {
            customer: customer
        }).then(function(results) {
            httpSrvc.toast(results);
            if (results.status == 'success') {
                $location.path('dashboard');
            }
        });
    };

    $scope.logout = function() {
        httpSrvc.get('logout').then(function(results) {
            httpSrvc.toast(results);
            $location.path('login');
        });
    };

}]);

// AUTHENTICATION SERVICE
coreApp.factory('AuthSrvc', ['DataSrvc', 'httpSrvc', function(DataSrvc) {
    // users auth.class.php to authenticate user and store permissions in session var
    var init = function() {
        // when authentication is complete the AppReadyState is set to true
        setTimeout(function() {
            DataSrvc.AppReadyState = true;
        }, 1500);
    };
    init();

    var service = {
        'user': {}
    };

    return service;
}]);

siteApp.directive('passwordMatch', [function() {
    return {
        restrict: 'A',
        scope   : true,
        require : 'ngModel',
        link    : function(scope, elem, attrs, control) {
            var checker = function() {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                if (e2 != null)
                    return e1 == e2;
            };
            scope.$watch(checker, function(n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);