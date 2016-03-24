/* global dashApp, baseApp */

// DATA FILTERS SERVICE
dashApp.factory('FilterSrvc', [function ()
{
    var dash = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'filters/get/all',
        readyState  = false;

    var extend = function(services) {
        dash = services;
        log  = dash.log;
    };

    /**
     * Create the data object
     * @param {object} filters
     */
    var init = function(filters)
    {
        var createModel = function() {
            log([['filters','i','silver'],filters]);
            var k = Object.keys(filters), l = k.length, i = 0, fltr, data = {};
            for (; i<l; i++) {
                fltr = filters[k[i]];
                data[fltr['name']] = {
                    'type' : fltr['type'],
                    'value': fltr['value'],
                    'label': fltr['label'],
                    'tmplt': getTemplate(fltr),
                    'opts' : typeofObject(fltr['opts'])==='object' ? fltr['opts'] : null
                };
            }
            dash.model.save('fltrs',data);
            readyState = true;
        };

        var getTemplate = function(filter) {
            var template = '',
                elemid   = '_fltr_'+filter['name'],
                ngmodel  = 'data.fltrs.'+filter['name']+'.value',
                onchange = 'fltr-watch when-changed="dash.filters.change(event)"';

            switch (filter['type']) {
                case 'checkbox':
                    template = '<input type="checkbox" id="'+elemid+'" ng-model="'+ngmodel+'" '+onchange+' />';
                    break;
                case 'select':
                    var options = 'data.fltrs.'+filter['name']+'.opts';
                    template = '<select id="'+elemid+'" ng-model="'+ngmodel+'" ng-options="opt.val as opt.lbl for opt in '+options+'" '+onchange+'></select>';
                    break;
            }

            return template;
        };

        createModel();
    };

    // An onchange event attached is to each filter on the dashboard. That event
    // sends the filter id to this function.  If we were instead watching the
    // filters object we wouldn't easily be able to tell what changed.
    function change(id) {
        log('filter id:' + id + ' has been changed', 'i', 'green');
    }

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