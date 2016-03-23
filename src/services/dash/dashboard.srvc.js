/* global dashApp */

/**
 * After FilterSrvc creates the model, it needs to send it to the data service via this DashboardSrvc
 * There will only be one model that the UI works from
 *
 * I think this can be done using a callback function with onready.init()
 */

// DASHBOARD SERVICE
dashApp.factory('DashboardSrvc',
['$interval', '$injector', 'AuthSrvc', 'DataSrvc', 'httpSrvc', 'uiSrvc', 'FilterSrvc', 'ChartSrvc', 'LayoutSrvc', 'PresetsSrvc', 'CstmViewsSrvc', 'SnapshotsSrvc', 'UserSrvc',
function ($interval, $injector, AuthSrvc, DataSrvc, httpSrvc, uiSrvc, FilterSrvc, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc)
{
    // define the services available to the AppController
    var service = {
        data    : DataSrvc.AppData,
        model   : DataSrvc.AppDataClass,
        ls      : DataSrvc.locStorage,
        pattern : DataSrvc.pattern,
        http    : httpSrvc,
        ui      : uiSrvc,
        log     : uiSrvc.log,
        filters : FilterSrvc['service']
    };
    angular.extend(service, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc);
    console.log(service);

    // define the services available to app factories via their extend() method
    var dashService = {
        model : DataSrvc.AppDataClass,
        ui    : uiSrvc,
        log   : uiSrvc.log
    };

    // extend each of the custom factories
    if (typeofObject(FilterSrvc,   'service.extend')==='function') FilterSrvc   ['service'].extend(dashService);
    if (typeofObject(ChartSrvc,    'service.extend')==='function') ChartSrvc    ['service'].extend(dashService);
    if (typeofObject(LayoutSrvc,   'service.extend')==='function') LayoutSrvc   ['service'].extend(dashService);
    if (typeofObject(PresetsSrvc,  'service.extend')==='function') PresetsSrvc  ['service'].extend(dashService);
    if (typeofObject(CstmViewsSrvc,'service.extend')==='function') CstmViewsSrvc['service'].extend(dashService);
    if (typeofObject(SnapshotsSrvc,'service.extend')==='function') SnapshotsSrvc['service'].extend(dashService);
    if (typeofObject(UserSrvc,     'service.extend')==='function') UserSrvc     ['service'].extend(dashService);


    // watch for DataSrvc.AppReadyState=true then perform each services onready procedure
    var watcher = $interval(function() {
            if (DataSrvc.AppReadyState === true) { resolve(); }
        }, 100),
        resolve = function () {
            $interval.cancel(watcher);

            var onready;

            if (typeofObject(FilterSrvc,'onready')==='object') {
                onready = FilterSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
            if (typeofObject(ChartSrvc,'onready')==='object') {
                onready = ChartSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
            if (typeofObject(LayoutSrvc,'onready')==='object') {
                onready = LayoutSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
            if (typeofObject(PresetsSrvc,'onready')==='object') {
                onready = PresetsSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
            if (typeofObject(CstmViewsSrvc,'onready')==='object') {
                onready = CstmViewsSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
            if (typeofObject(SnapshotsSrvc,'onready')==='object') {
                onready = SnapshotsSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
            if (typeofObject(UserSrvc,'onready')==='object') {
                onready = UserSrvc['onready'];
                httpSrvc.select(onready['api']).then(function(data) { onready.init(data); });
            }
        };

    return service;
}]);
