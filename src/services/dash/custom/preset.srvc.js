/* global dashApp */

// PRESET VIEW SERVICE
dashApp.factory('PresetsSrvc', [function () 
{
    var dash = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'presets/get/all',
        readyState  = false;


    var extend = function (services) {
        dash = services;
        log  = dash.log;
    };

    /**
     * Create the data object
     * @param {object} presets
     */
    var init = function (presets) {
        var createModel = function () {
            log([['presets', 'i', 'silver'], presets]);
            var k = Object.keys(presets), l = k.length, i = 0, preset, data = {};
            for (; i < l; i++) {
                preset               = presets[k[i]];
                data[preset['name']] = {
                    'xyz': chart['xyz']
                };
            }
            dash.model.save('presets', data);
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
