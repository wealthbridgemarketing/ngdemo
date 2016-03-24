/* global dashApp */

// CUSTOM VIEW SERVICE
dashApp.factory('CstmViewsSrvc', [function () 
{
    var dash = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'cstmviews/get/all',
        readyState  = false;


    var extend = function (services) {
        dash = services;
        log  = dash.log;
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
            dash.model.save('cstmviews', data);
            readyState = true;
        };

        createModel();
    };

    // return this factories services
    return {
        'service': {
            'ready' : readyState,
            'change': change
        },
        'onready': {
            'api'   : apiEndpoint,
            'init'  : init,
            'extend': extend
        }
    };
}]);
