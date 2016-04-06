/* global baseApp */

// CUSTOM VIEW SERVICE
baseApp.factory('CstmViewsSrvc', [function () 
{
    var base = {},
        apiEndpoint = 'cstmviews/get/all';


    var extend = function (services) { base = services; };

    /**
     * Create the data object
     * @param {object} cstmviews
     */
    var init = function (cstmviews) {
        var createModel = function () {
            log([['cstmviews', 'i', 'silver'], cstmviews]);
            var k = Object.keys(cstmviews), l = k.length, i = 0, cstmview, data = {};
            for (; i < l; i++) {
                cstmview               = cstmviews[k[i]];
                data[cstmview['name']] = {
                    'xyz': chart['xyz']
                };
            }
            base.model.save('cstmviews', data);
        };
        //createModel();
    };

    // return this factories services
    return {
        'service': {},
        'onready': {
            'api'   : apiEndpoint,
            'init'  : init,
            'extend': extend
        }
    };
}]);
