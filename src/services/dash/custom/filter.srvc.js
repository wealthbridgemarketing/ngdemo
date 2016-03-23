/* global dashApp, baseApp */

// DATA FILTERS SERVICE
dashApp.factory('FilterSrvc', [function ()
{
    var apiEndpoint = 'filters/get/all',
        dataModel   = {},
        readyState  = false;

    /**
     * Create the dataModel object
     *
     * The DashboardSrvc waits until AppReadyState=true and then uses the onready procedure
     * to retrieve the filter data from the remote api which it passes to this function.

     * @param {object} filters
     */
    var init = function(filters)
    {
        var createModel = function() {
            console.log('filters');
            console.log(filters);
            console.log(this);
            var k = Object.keys(filters), l = k.length, i = 0, fltr;
            for (; i<l; i++) {
                fltr = filters[k[i]];
                dataModel[fltr['name']] = {
                    'type' : fltr['type'],
                    'value': fltr['value'],
                    'label': fltr['label'],
                    'tmplt': getTemplate(fltr),
                    'opts' : typeofObject(fltr['opts'])==='object' ? fltr['opts'] : null
                };
            }
            readyState = true;
        };

        var getTemplate = function(filter) {
            var tmplt  = '',
                id     = '_fltr_'+filter['name'],
                model  = 'dash.fltrs.data.'+filter['name']+'.value',
                change = 'fltr-watch when-changed="dash.fltrs.change(event)"';

            switch (filter['type']) {
                case 'checkbox':
                    tmplt = '<input type="checkbox" id="'+id+'" ng-model="'+model+'" '+change+' />';
                    break;
                case 'select':
                    var options = 'dash.fltrs.data.'+filter['name']+'.opts';
                    tmplt = '<select id="'+id+'" ng-model="'+model+'" ng-options="opt.val as opt.lbl for opt in '+options+'" '+change+'></select>';
                    break;
            }

            return tmplt;
        };

        createModel();
    };

    // An onchange event attached is to each filter on the dashboard. That event
    // sends the filter id to this function.  If we were instead watching the
    // filters object we wouldn't easily be able to tell what changed.
    function change(id) {
        this.ui.log('filter id:' + id + ' has been changed', 'i', 'silver');
    }

    // return this factories services
    return {
        'service': {
            'ready' : readyState,
            'data'  : dataModel,
            'change': change
        },
        'onready': {
            'api' : apiEndpoint,
            'init': init
        }
    };
}]);


baseApp.directive('fltrWatch', [function () {
    return {
        restrict: 'A',
        scope: {
            whenChanged: "&"
        },
        link: function (scope, element, attrs) {
            element.on('change', function (event) {
                var id = event.target.id.replace(/\D/g, '');
                scope.whenChanged({event: id});
                scope.$apply();
            });
        }
    };
}]);