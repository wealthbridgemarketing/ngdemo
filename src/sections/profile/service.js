/* global siteApp */

siteApp.controller('ProfileCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {
    
    Breadcrumbs.set([
      { text: 'Edit Profile' }
    ]);

}]);
  