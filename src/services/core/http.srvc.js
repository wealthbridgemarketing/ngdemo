/* global coreApp */

/**
 * httpService - Facilitates all client/server communications.
 *
 * @todo Integrate the AuthFactory using:
 *       headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
 *       see: read authorization header in php: http://www.omaroid.com/php-get-and-set-custom-http-headers/
 * 
 * @todo Integrate the PersistFactory using:
 *       see: http://www.revillweb.com/angularjs-by-example/4-sharing-data-with-angularjs-services/
 */
coreApp.factory('httpService', ['DataService', '$http', '$q', function(DataService, $http, $q)
{
  var config = {
    method : 'GET',
    url    : 'http://localhost/inteleview/analytics/backend/api/',
    data   : {}, // obj,
    params : {}  // str || obj
  };
  
  //===================================================================================================
  //=  PUBLIC METHODS  ================================================================================
  //===================================================================================================

  function getData(params, qs) {
    config.method = 'GET';
    if (isValid(qs)) config.url += qs;
    isValid(params) ? config.params = params : delete config.params;
    delete config.data;
    
    sendRequest().then(function(response){ return response; });
  };

  function putData(data, params) {
    config.method = 'PUT';
    if (isValid(data)) config.url = data;
    isValid(params) ? config.params = params : delete config.params;
    
    sendRequest().then(function(response){ return response; });
  };

  function postData(data, params) {
    config.method = 'POST';
    if (isValid(data)) config.url = data;
    isValid(params) ? config.params = params : delete config.params;
    
    sendRequest().then(function(response){ return response; });
  };

  function deleteData(params, qs) {
    config.method = 'DELETE';
    if (isValid(qs)) config.url += qs;
    isValid(params) ? config.params = params : delete config.params;
    delete config.data;
    
    sendRequest().then(function(response){ return response; });
  };
  
  //===================================================================================================
  //=  PRIVATE METHODS  ===============================================================================
  //===================================================================================================
  
  // argument validation
  var isValid = function(val) {
    return typeof val === undefined || val.length <= 0 ? false : true;
  };
  
  // send the $http request
  var sendRequest = function() {
    return $http( config ).
              then(function(response) {
                return handleSuccess(response);
              }, function(response) {
                return handleError(response);
              });    
  };
  
  // request succeeded
  var handleSuccess = function(response) {
    return( response.data );
  };
  
  // request failed
  var handleError = function(response) {
    if ( ! angular.isObject( response.data ) || ! response.data.message ) {
      return( $q.reject( 'An unknown error occurred.' ) );
    }
    return( $q.reject( response.data.message ) );
  };
  
  // Return the Service
  var service = {
    'getData'    : getData,
    'putData'    : putData,
    'postData'   : postData,
    'deleteData' : deleteData
  };
  
  return service;
}]);