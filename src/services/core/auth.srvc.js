/* global coreApp */

// AUTHENTICATION SERVICE
coreApp.factory('AuthSrvc', ['DataSrvc', 'httpSrvc', '$q', function(DataSrvc, httpSrvc, $q)
{
  // users auth.class.php to authenticate user and store permissions in session var
  var init = function() {
    // when authentication is complete the AppReadyState is set to true
    setTimeout(function(){ DataSrvc.AppReadyState = true; },1500);
  };
  init();

  var service = {
    'user': {}
  };
  
  return service;
}]);