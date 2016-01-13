/* global baseApp */

baseApp.controller('AnalyticsCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {

  Breadcrumbs.set([
    { text: 'Analytics' }
  ]);

}]);
