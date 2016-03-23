/* global dashApp */

/**
 * After FilterSrvc creates the model, it needs to send it to the data service via this DashboardSrvc
 * There will only be one model that the UI works from
 *
 * I think this can be done using a callback function with onready.init()
 */

// DASHBOARD SERVICE
dashApp.factory('DashboardSrvc',
['$interval', 'AuthSrvc', 'DataSrvc', 'httpSrvc', 'uiSrvc', 'FilterSrvc', 'ChartSrvc', 'LayoutSrvc', 'PresetsSrvc', 'CstmViewsSrvc', 'SnapshotsSrvc', 'UserSrvc',
function ($interval, AuthSrvc, DataSrvc, httpSrvc, uiSrvc, FilterSrvc, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc)
{
    // everything in service is made available to the AppController
    var service = {
        ui      : uiSrvc,
        ls      : DataSrvc.locStorage,
        pattern : DataSrvc.getPattern(),
        http    : httpSrvc,
        fltrs   : FilterSrvc['service']
    };
    
    angular.extend(service, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc);
    console.log(service);

    // watch for AppReadyState=true then perform each services onready procedure
    var watcher = $interval(function() {
            if (DataSrvc.AppReadyState === true) { resolve(); }
        }, 100),
        resolve = function () {
            $interval.cancel(watcher);

            var onready;

            onready = FilterSrvc['onready'];
            httpSrvc.select(onready['api']).then(function(data) {
                onready.init(data);
            });
        };

    return service;
}]);
