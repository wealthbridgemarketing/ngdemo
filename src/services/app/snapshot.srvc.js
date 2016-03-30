/* global baseApp */

// SNAPSHOT SERVICE
baseApp.factory('SnapshotsSrvc', [function () 
{
    var base = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'snapshots/get/all',
        readyState  = false;

    var extend = function (services) {
        base = services;
        log  = base.log;
    };

    /**
     * Create the data object
     * @param {object} snapshots
     */
    var init = function (snapshots) {
        var createModel = function () {
            log([['snapshots', 'i', 'silver'], snapshots]);
            var k = Object.keys(snapshots), l = k.length, i = 0, snapshot, data = {};
            for (; i < l; i++) {
                snapshot               = snapshots[k[i]];
                data[snapshot['name']] = {
                    'xyz': chart['xyz']
                };
            }
            base.model.save('snapshots', data);
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
