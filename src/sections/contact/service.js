/* global siteApp */

siteApp.controller('ContactCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {
    
  Breadcrumbs.set([
    { text: 'Contact Us' }
  ]);
  
  $scope.contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
}]);
  