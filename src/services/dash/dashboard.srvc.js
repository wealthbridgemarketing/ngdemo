/* global dashApp */

/**
 * DASHBOARD SERVICE - World class facilitator and Back of the house Boss!
 *
 * The custom application services injected into the Dashboard have a special architecture that allows
 * them to functioncorrectly within this system.
 *
 * 1. The services have no auto-initialization code.  This DashboardSrvc takes care of that for them.
 * 2. They don't contain data, although they are responsible for maintaining a part of the app data model.
 * 3. They define an onready procedure along with their public service(s).  The onready procedure contains:
 *      a) the apiEndpoint to use for retrieving the data it needs.
 *      b) a function that will be called to deliver the data.
 *      c) an extend() function that allows this service to pass in the additional services it needs.
 *
 * The services extended include the entire uiSrvc service and the DataSrvc.AppDataClass which allows them
 * to save the data they process back to the global app model.
 *
 * A watcher is put on DataSrvc.AppReadyState and after it turns true the work of retrieving data for the
 * custom app services begins.
 *
 * This method of implementing services requiring data from a remote service solves one of the biggest
 * problems with front-end applications: Code Impatience and Wasted Resources!  It might be easier to
 * think of it in terms of a parent providing services like dinner, laundry and free rides.  The child
 * in most cases wouldn't think of forcing the issue and attempting to accomplish these tasks on his/her
 * own.  They instead wait until the parent is ready.
 *
 * You could think of DashboardSrvc as a parent that takes care of business in a timely and appropriate
 * manner.  It's children, the custom app services, all make reasonable requests of the parent and those
 * requests will all be filled just as soon as it's safe to do so.
 *
 * Following the parent/child paradigm, the DataSrvc and httpSrvc are like lifelong friends of DashboardSrvc
 * and prefer to work directly with it instead of it's kids.  In fact, the children don't interact directly
 * with those services at all.  They are permitted very limited access in order to work with the app data
 * model, and they only reason they have that access is because their parent extended that right to them.
 *
 * The AuthSrvc is a loner, having nobody that talks to it directly.  It's responsible for security throughout
 * the entire application so it stands to reason why it's so serious.  It's not really the boss but it's in a
 * positionof huge power and authority.  Nobody makes a move before it sounds the all clear, which it does by
 * setting the AppReadyState to true in the DataSrvc.  The AuthSrvc is the only other service in the entire
 * system that has a direct connection to the DataSrvc and httpSrvc services.
 *
 * Finally there is AppCtrl who could be considered a spouse or business partner of DashboardSrvc.  It sits
 * out front and is the only service that matters in terms of building the UI. The UI-Router and Breadcrumbs
 * services work with it directly.  Everything DashboardSrvc does is to support AppCtrl.  All of the public
 * services provided by the custom app services, uiSrvc and DataSrvc are defined in the $service var below
 * and available to everybody using the AppCtrl service, which is everything you see on the front end.
 *
 *
 *
 * The UserSrvc needs to be moved to the base directory and and the utilApp type is going away.  It's
 * going to be consumed by the DashboardSrvc so that it's available throughout the system.
 */
dashApp.factory('DashboardSrvc',
['$interval', 'AuthSrvc', 'DataSrvc', 'httpSrvc', 'uiSrvc', 'FilterSrvc', 'ChartSrvc', 'LayoutSrvc', 'PresetsSrvc', 'CstmViewsSrvc', 'SnapshotsSrvc', 'UserSrvc',
function ($interval, AuthSrvc, DataSrvc, httpSrvc, uiSrvc, FilterSrvc, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc)
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
        filters : FilterSrvc['service'],
        charts  : ChartSrvc['service'],
        layouts : LayoutSrvc['service'],
        presets : PresetsSrvc['service'],
        cstmvws : CstmViewsSrvc['service'],
        snpshts : SnapshotsSrvc['service'],
        users   : UserSrvc['service']
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
    var watcher = $interval(function() { if (DataSrvc.AppReadyState === true) { resolve(); } }, 100),
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
