/* global siteApp */

siteApp.controller('SiteCtrl', ['$scope', '$rootScope', 'Breadcrumbs', 'BaseSrvc', function($scope, $rootScope, Breadcrumbs, BaseSrvc)
{
  // page title
  $rootScope.$on('SiteCtrl.setPageTitle', function(event, title) {
    $scope.pageTitle = title;
  });

  // Base Service
  $scope.base = BaseSrvc;
  var log = $scope.base.log;

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