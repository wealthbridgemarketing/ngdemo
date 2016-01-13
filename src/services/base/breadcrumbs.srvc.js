/* global baseApp */

/**
 * Used to manage $scope.breadcrumbs in AppCtrl
 * 
 * The last element is the active page and 
 * should not contain the 'state' property.
 * 
 * Object Properties
 * text: breadcrumb text
 * state: ui.router state name
 * 
    app.controller('NewCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {

      Breadcrumbs.set([
        { text: 'Library', state: 'library' },
        { text: 'Data' }
      ]);

    }]);
 *
 */
baseApp.service('Breadcrumbs', [function() {
  
  var breadcrumbs = false;
  
  this.set = function(obj) {
    breadcrumbs = obj;
  };
  
  this.get = function() {
    return breadcrumbs;
  };
  
  this.clear = function() {
    breadcrumbs = false;
  };
  
}]);