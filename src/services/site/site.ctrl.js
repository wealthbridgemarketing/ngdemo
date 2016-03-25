/* global siteApp */

siteApp.controller('AppCtrl', ['$scope', '$rootScope', 'Breadcrumbs', 'MainSrvc', function($scope, $rootScope, Breadcrumbs, MainSrvc)
{
  // page title
  $rootScope.$on('AppCtrl.setPageTitle', function(event, title) {
    $scope.pageTitle = title;
  });

  // Dashboard Service
  $scope.dash = MainSrvc;
  var log = $scope.dash.log;

  // breadcrumbs
  $scope.breadcrumbs = false;
  $scope.$watch(function() { return Breadcrumbs.get(); }, function(newVal) {
    $scope.breadcrumbs = newVal;
  }, true);

  // DrillSrvc testing
  $scope.counter = 0;
  $scope.increment = function() {
    $scope.counter++;
  };

}]);