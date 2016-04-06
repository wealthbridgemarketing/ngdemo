/* global baseApp */

// SNAPSHOT SERVICE
baseApp.factory('SnapshotsSrvc', [function () 
{
    var base = {},
        apiEndpoint = 'snapshots/get/all';

    var extend = function (services) { base = services; };

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
