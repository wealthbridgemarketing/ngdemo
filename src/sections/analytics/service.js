/* global siteApp */

siteApp.controller('AnalyticsCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {

  Breadcrumbs.set([
    { text: 'Analytics' }
  ]);

}]);
