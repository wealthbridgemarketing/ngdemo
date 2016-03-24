/* global dashApp */

// LAYOUT SERVICE
dashApp.factory('LayoutSrvc', [function () 
{
    var dash = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'layouts/get/all',
        readyState  = false;


    var extend = function (services) {
        dash = services;
        log  = dash.log;
    };

    /**
     * Create the data object
     * @param {object} layouts
     */
    var init = function (layouts) {
        var createModel = function () {
            log([['layouts', 'i', 'silver'], layouts]);
            var k = Object.keys(layouts), l = k.length, i = 0, layout, data = {};
            for (; i < l; i++) {
                layout               = layouts[k[i]];
                data[layout['name']] = {
                    'xyz': chart['xyz']
                };
            }
            dash.model.save('layouts', data);
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
