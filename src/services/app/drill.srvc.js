/* global mainApp, siteApp */

// DATA drills SERVICE
mainApp.factory('DrillSrvc', [function ()
{
    var dash = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'drills/get/all',
        readyState  = false;

    var extend = function(services) {
        dash = services;
        log  = dash.log;
    };

    /**
     * Create the data object
     * @param {object} drills
     */
    var init = function(drills)
    {
        var createModel = function() {
            log([['drills','i','silver'],drills]);
            var k = Object.keys(drills), l = k.length, i = 0, fltr, data = {};
            for (; i<l; i++) {
                fltr = drills[k[i]];
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

        var getTemplate = function(drill) {
            var template = '',
                elemid   = '_fltr_'+drill['name'],
                ngmodel  = 'data.fltrs.'+drill['name']+'.value',
                onchange = 'fltr-watch when-changed="dash.drills.change(event)"';

            switch (drill['type']) {
                case 'checkbox':
                    template = '<input type="checkbox" id="'+elemid+'" ng-model="'+ngmodel+'" '+onchange+' />';
                    break;
                case 'select':
                    var options = 'data.fltrs.'+drill['name']+'.opts';
                    template = '<select id="'+elemid+'" ng-model="'+ngmodel+'" ng-options="opt.val as opt.lbl for opt in '+options+'" '+onchange+'></select>';
                    break;
            }

            return template;
        };

        createModel();
    };

    // An onchange event attached is to each drill on the dashboard. That event
    // sends the drill id to this function.  If we were instead watching the
    // drills object we wouldn't easily be able to tell what changed.
    function change(id) {
        log('drill id:' + id + ' has been changed', 'i', 'green');
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


siteApp.directive('drillWatch', [function () {
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