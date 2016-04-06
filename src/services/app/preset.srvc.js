/* global baseApp */

// PRESET VIEW SERVICE
baseApp.factory('PresetsSrvc', [function () 
{
    var base = {},
        apiEndpoint = 'presets/get/all';

    var extend = function (services) { base = services; };

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
            base.model.save('presets', data);
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
