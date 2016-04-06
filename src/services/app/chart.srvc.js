/* global baseApp */

// CHARTS SERVICE
baseApp.factory('ChartSrvc', [function ()
{
    var base = {},
        apiEndpoint = 'chartdefs/get/all';

    var extend = function (services) { base = services; };

    /**
     * Create the data object
     * @param {object} chartdefs
     */
    var init = function (chartdefs) {
        var createModel = function () {
            log([['chartdefs', 'i', 'silver'], chartdefs]);
            var k = Object.keys(chartdefs), l = k.length, i = 0, chart, data = {};
            for (; i < l; i++) {
                chart               = chartdefs[k[i]];
                data[chart['name']] = {
                    'xyz': chart['xyz']
                };
            }
            base.model.save('charts', data);
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
