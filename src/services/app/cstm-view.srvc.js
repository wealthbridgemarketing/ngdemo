/* global baseApp */

// CUSTOM VIEW SERVICE
baseApp.factory('CstmViewsSrvc', [function () 
{
    var base = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'cstmviews/get/all',
        readyState  = false;


    var extend = function (services) {
        base = services;
        log  = base.log;
    };

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
            readyState = true;
        };

        //createModel();
    };

    // return this factories services
    return {
        'service': {
            'ready' : readyState
        },
        'onready': {
            'api'   : apiEndpoint,
            'init'  : init,
            'extend': extend
        }
    };
}]);
