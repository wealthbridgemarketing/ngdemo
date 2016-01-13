/* global baseApp */

baseApp.controller('ContactCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {
    
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
  