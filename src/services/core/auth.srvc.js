/* global coreApp */

// AUTHENTICATION SERVICE
coreApp.factory('AuthSrvc', ['DataSrvc', 'httpSrvc', '$q', function(DataSrvc, httpSrvc, $q)
{
  // when authentication is complete the AppReadyState is set to true
  setTimeout(function(){ DataSrvc.AppReadyState = true; },1500);

  var service = {
    'user': {}
  };
  
  return service;
}]);