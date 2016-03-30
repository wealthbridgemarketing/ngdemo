/* global baseApp, siteApp */

// DATA drills SERVICE
baseApp.factory('DrillSrvc', [function ()
{
    var base = {},
        log  = function(m){console.log(m);},
        apiEndpoint = 'drills/get/all',
        readyState  = false;

    var extend = function(services) {
        base = services;
        log  = base.log;
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
            base.model.save('fltrs',data);
            readyState = true;
        };

        var getTemplate = function(drill) {
            var template = '',
                elemid   = '_fltr_'+drill['name'],
                ngmodel  = 'data.fltrs.'+drill['name']+'.value',
                onchange = 'fltr-watch when-changed="base.drills.change(event)"';

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

    // An onchange event attached is to each drill in the view. That event
    // sends the drill id to this function.  If we were instead watching the
    // drills object we wouldn't easily be able to tell what changed.
    function change(ele) {
        switch (ele['type']) {
            case 'checkbox':
                log('DRILL CHANGE EVENT. '+ele['type']+' '+ele['name']+'['+ele['id']+'] = '+ele['value'], 'i', 'green');
                break;
            case 'select':
                var idx = !!ele['id'] ? ele['id'] : ele['name'];
                log('DRILL CHANGE EVENT. '+ele['type']+' '+idx+' = '+ele['value'], 'i', 'green');
            default:
                log('UNKNOWN DRILL CHANGE EVENT. type: '+ele['type']+' name: '+ele['name']+' id: '+ele['id']+' value: '+ele['value'], 'w', 'red');
        }
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
                //console.log(event);
                var value = event.target.type==='checkbox' ? event.target.checked : event.target.value;
                scope.whenChanged({event: {'type':event.target.type, 'name':event.target.name, 'id':event.target.id, 'value':value}});
                scope.$apply();
            });
        }
    };
}]);