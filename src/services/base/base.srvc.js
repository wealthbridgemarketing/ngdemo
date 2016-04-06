/* global baseApp */

/**
 * BASE SERVICE - World class facilitator and Back of the house Boss!
 *
 * The custom application services injected into BaseSrvc have a special architecture that allows
 * them to functioncorrectly within this system.
 *
 * 1. The services have no auto-initialization code.  This BaseSrvc takes care of that for them.
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
 * You could think of BaseSrvc as a parent that takes care of business in a timely and appropriate
 * manner.  It's children, the custom app services, all make reasonable requests of the parent and those
 * requests will all be filled just as soon as it's safe to do so.
 *
 * Following the parent/child paradigm, the DataSrvc and httpSrvc are like lifelong friends of BaseSrvc
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
 * Finally there is AppCtrl who could be considered a spouse or business partner of BaseSrvc.  It sits
 * out front and is the only service that matters in terms of building the UI. The UI-Router and Breadcrumbs
 * services work with it directly.  Everything BaseSrvc does is to support AppCtrl.  All of the public
 * services provided by the custom app services, uiSrvc and DataSrvc are defined in the $service var below
 * and available to everybody using the AppCtrl service, which is everything you see on the front end.
 *
 *
 *
 * The UserSrvc needs to be moved to the base directory and and the siteApp type is going away.  It's
 * going to be consumed by the BaseSrvc so that it's available throughout the system.
 */
baseApp.factory('BaseSrvc', ['$interval',
                    'DataSrvc','httpSrvc', 'AuthSrvc','uiSrvc',
                    'DrillSrvc','ChartSrvc','LayoutSrvc','PresetsSrvc','CstmViewsSrvc','SnapshotsSrvc','UserSrvc',
function ($interval,
          DataSrvc, httpSrvc, AuthSrvc, uiSrvc,
          DrillSrvc, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc)
{
    // define the basic services that are available early
    var service = {
        ready  : false,
        ls     : DataSrvc.locStorage,
        pattern: DataSrvc.regxPatterns,
        ui     : uiSrvc
    };
    //log([['[ts] Basic BaseSrvc Services','i','black'],service]);

    // watch for DataSrvc.AppReadyState=true then perform each service providers onready procedure
    var watcher = $interval(function() { if (DataSrvc.AppReadyState === true) { resolve(); } }, 100),
        resolve = function () {
            $interval.cancel(watcher);

            // determine if a service requires data when loaded
            var srvcRequiresData = function(service) {
                if (typeofObject(service, 'onready')      === 'object'
                 && typeofObject(service, 'onready.api')  === 'string'
                 && typeofObject(service, 'onready.init') === 'function')
                {
                    return true;
                }
                else return false;
            };
            
            // remote api calls to fetch the data for each service
            if (srvcRequiresData(    DrillSrvc)) httpSrvc.select(    DrillSrvc.onready.api).then(function(data) {     DrillSrvc.onready.init(data); });
            if (srvcRequiresData(    ChartSrvc)) httpSrvc.select(    ChartSrvc.onready.api).then(function(data) {     ChartSrvc.onready.init(data); });
            if (srvcRequiresData(   LayoutSrvc)) httpSrvc.select(   LayoutSrvc.onready.api).then(function(data) {    LayoutSrvc.onready.init(data); });
            if (srvcRequiresData(  PresetsSrvc)) httpSrvc.select(  PresetsSrvc.onready.api).then(function(data) {   PresetsSrvc.onready.init(data); });
            if (srvcRequiresData(CstmViewsSrvc)) httpSrvc.select(CstmViewsSrvc.onready.api).then(function(data) { CstmViewsSrvc.onready.init(data); });
            if (srvcRequiresData(SnapshotsSrvc)) httpSrvc.select(SnapshotsSrvc.onready.api).then(function(data) { SnapshotsSrvc.onready.init(data); });
            if (srvcRequiresData(     UserSrvc)) httpSrvc.select(     UserSrvc.onready.api).then(function(data) {      UserSrvc.onready.init(data); });

            // define the services available to service providers via their extend() method
            var providerServices = {
                data  : DataSrvc.AppData,
                model : DataSrvc.AppDataClass,
                ui    : uiSrvc
            };

            // send the providerServices to each service provider
            if (typeofObject(    DrillSrvc,'onready.extend')==='function')     DrillSrvc.onready.extend(providerServices);
            if (typeofObject(    ChartSrvc,'onready.extend')==='function')     ChartSrvc.onready.extend(providerServices);
            if (typeofObject(   LayoutSrvc,'onready.extend')==='function')    LayoutSrvc.onready.extend(providerServices);
            if (typeofObject(  PresetsSrvc,'onready.extend')==='function')   PresetsSrvc.onready.extend(providerServices);
            if (typeofObject(CstmViewsSrvc,'onready.extend')==='function') CstmViewsSrvc.onready.extend(providerServices);
            if (typeofObject(SnapshotsSrvc,'onready.extend')==='function') SnapshotsSrvc.onready.extend(providerServices);
            if (typeofObject(     UserSrvc,'onready.extend')==='function')      UserSrvc.onready.extend(providerServices);
            
            // complete the services definition
            var appServices = {
                data    : DataSrvc.AppData,
                model   : DataSrvc.AppDataClass,
                http    : httpSrvc,
                drills  : DrillSrvc['service'],
                charts  : ChartSrvc['service'],
                layouts : LayoutSrvc['service'],
                presets : PresetsSrvc['service'],
                cstmvws : CstmViewsSrvc['service'],
                snpshts : SnapshotsSrvc['service'],
                users   : UserSrvc['service']
            };
            angular.extend(service, appServices);
            //log([['[ts] Full BaseSrvc Services','i','black'],service]);

            // notify siteApp that base service is ready
            service.ready = true;

            return;
        };

    return service;
}]);
