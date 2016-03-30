/* global coreApp */

/**
 * httpSrvc - Facilitates all client/server communications.
 *
 * @todo Integrate the AuthFactory using:
 *       headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
 *       see: read authorization header in php: http://www.omaroid.com/php-get-and-set-custom-http-headers/
 *
 * @todo Integrate the PersistFactory using:
 *       see: http://www.revillweb.com/angularjs-by-example/4-sharing-data-with-angularjs-services/
 */
coreApp.factory('httpSrvc', ['DataSrvc','CFG', '$http', '$q', function (DataSrvc, CFG, $http, $q)
{
    var config = {
        method: 'GET',
        url   : CFG.API_BASE_PATH,
        params: {}  // str || obj
    };

    //===================================================================================================
    //=  PUBLIC METHODS  ================================================================================
    //===================================================================================================

    var apiSelect = function(api, params) {
        var defer = $q.defer();
        
        config.method = 'GET';
        if (isValid(api)) config.url += api;
        isValid(params) ? config.params = params : delete config.params;

        sendRequest().then(function(response) { defer.resolve(response); });

        return defer.promise;
    };

    var apiInsert = function(api, params) {
        var defer = $q.defer();

        config.method = 'PUT';
        if (isValid(data)) config.url = api;
        isValid(params) ? config.params = params : delete config.params;

        sendRequest().then(function(response) { defer.resolve(response); });

        return defer.promise;
    };

    var apiUpdate = function(api, params) {
        var defer = $q.defer();

        config.method = 'POST';
        if (isValid(data)) config.url = api;
        isValid(params) ? config.params = params : delete config.params;

        sendRequest().then(function(response) { defer.resolve(response); });

        return defer.promise;
    };

    var apiDelete = function(api, params) {
        var defer = $q.defer();

        config.method = 'DELETE';
        if (isValid(api)) config.url += api;
        isValid(params) ? config.params = params : delete config.params;

        sendRequest().then(function(response) { defer.resolve(response); });

        return defer.promise;
    };

    //===================================================================================================
    //=  PRIVATE METHODS  ===============================================================================
    //===================================================================================================

    // argument validation
    var isValid = function (val) {
        return !!(typeof val !== 'undefined' && val.length > 0);
    };

    // send the $http request
    var sendRequest = function () {
        // hack code for now
        var defer = $q.defer();
        setTimeout(function() {
            var response = { 'data': { 'a':1, 'b':2, 'c':3 } };
            defer.resolve( handleSuccess(response) );
        },500);
        return defer.promise;

        // return $http(config).then(function (response) {
        //     return handleSuccess(response);
        // }, function (response) {
        //     return handleError(response);
        // });
    };

    // request succeeded
    var handleSuccess = function (response) {
        return ( response.data );
    };

    // request failed
    var handleError = function (response) {
        if (!angular.isObject(response.data) || !response.data.message) {
            return ( $q.reject('An unknown error occurred.') );
        }
        return ( $q.reject(response.data.message) );
    };

    // Return the Service
    var service = {
        'select': apiSelect,
        'insert': apiInsert,
        'update': apiUpdate,
        'delete': apiDelete
    };

    return service;
}]);