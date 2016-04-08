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
    /**
     * Make XMLHttpRequest request using $http service
     * @param {string} method - GET, POST, PUT, DELETE
     * @param {string} url - Api url part that follows API_BASE_PATH, optionally parameterized
     * @param {object=} data - Only used for POST and PUT
     * @param {object=} params
     * @returns {*}
     */
    var http = function(method, url, data, params) {

        var config = {
            method: method,
            url   : CFG.API_BASE_PATH + url
        };
        if (data !== null) config.data = data;
        if (params !== null) config.params = params;

        return $http(config).then(
            function (response) { return response; },
            function (response) { return response; }
        );
    };

    /**
     * Public Methods
     *
     * The response object returned from the server has these properties:
     * data       – {string|Object} – The response body transformed with the transform functions.
     * status     – {number}        – HTTP status code of the response.
     * config     – {Object}        – The configuration object that was used to generate the request.
     * statusText – {string}        – HTTP status text of the response.
     * headers    – {function([headerName])} – Header getter function.
     */
    var service = {
        /**
         * Get a record(s)
         * @param {string} url     - /books/:id
         * @param {object=} params - {'id':5}
         */
        'get': function(url, params) {
            var defer = $q.defer();

            if (params===undefined) params = null;

            http('GET', url, null, params).then(
                function(response) { defer.resolve(response); }
            );

            return defer.promise;
        },

        /**
         * Insert a new record
         * @param {string} url  - /books
         * @param {object} data - {'name':'Moby Dick', 'isbn':12345}
         * @param {object=} params
         */
        'post': function(url, data, params) {
            var defer = $q.defer();

            if (params===undefined) params = null;

            http('POST', url, data, params).then(
                function(response) { defer.resolve(response); }
            );

            return defer.promise;
        },

        /**
         * Update an existing record
         * @param {string} url  - /books/:id
         * @param {object} data - {'id':5, 'name':'Moby Dick', 'isbn':12345}
         * @param {object=} params
         */
        'put': function(url, data, params) {
            var defer = $q.defer();

            if (params===undefined) params = null;

            http('PUT', url, data, params).then(
                function(response) { defer.resolve(response); }
            );

            return defer.promise;
        },

        /**
         * Delete a record(s)
         * @param {string} url     - /books/:id
         * @param {object=} params - {'id':5}
         */
        'delete': function(url, params) {
            var defer = $q.defer();

            if (params===undefined) params = null;

            http('DELETE', url, null, params).then(
                function(response) { defer.resolve(response); }
            );

            return defer.promise;
        }
    };

    // Return the Service
    return service;
}]);