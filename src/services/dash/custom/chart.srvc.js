/* global dashApp */

// CHARTS SERVICE
dashApp.factory('ChartSrvc', [function ()
{
    var dash = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'chartdefs/get/all',
        readyState  = false;


    var extend = function (services) {
        dash = services;
        log  = dash.log;
    };

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
            dash.model.save('charts', data);
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
