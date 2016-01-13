/* global dashApp, baseApp */

// DATA FILTERS SERVICE
dashApp.factory('FilterSrvc', [function()
{
  var filters = {};

  var service = {
    'filters': filters,
    'fltrChange': fltrChange
  };

  // An onchange event attached is to each filter on the dashboard. That event
  // sends the filter id to this function.  If we were instead watching the
  // filters object we wouldn't easily be able to tell what changed.
  function fltrChange(id) {
    console.log('filter id:'+id+' has been changed');
  };

  return service;
}]);


baseApp.directive('fltrWatch', [function()
{
  return {
    restrict: 'A',
    scope: {
      whenChanged: "&"
    },
    link: function(scope, element, attrs) {
      element.on('change', function(event) {
        var id = event.target.id.replace(/\D/g, '');
        scope.whenChanged({event: id});
        scope.$apply();
      });
    }
  };
}]);