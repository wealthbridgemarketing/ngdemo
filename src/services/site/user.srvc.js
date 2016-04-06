/* global siteApp */

// USER SERVICE
siteApp.factory('UserSrvc', [function ()
{
  var base = {},
      apiEndpoint = 'users/get/authenticated';

  var extend = function (services) { base = services; };

  /**
   * Create the data object
   * @param {object} layouts
   */
  var init = function (user) {
    var saveModel = function () {
      var user = {
        'first_name' : 'Kara',
        'last_name'  : 'Zor-El',
        'company'    : 'Department of Extranormal Operations',
        'email'      : 'supergirl@deo.com',
        'timezone_id': '6',
        'username'   : 'supergirl',
        'password'   : '11111122333',
        'password2'  : '11111122333',
        'meta'       : {
          'timezones': [
            {'id': '1', 'name': '(GMT-10:00) Hawaii'},
            {'id': '2', 'name': '(GMT-09:00) Alaska'},
            {'id': '3', 'name': '(GMT-08:00) Pacific Time (US & Canada)'},
            {'id': '4', 'name': '(GMT-07:00) Arizona'},
            {'id': '5', 'name': '(GMT-07:00) Mountain Time (US & Canada)'},
            {'id': '6', 'name': '(GMT-06:00) Central Time (US & Canada)'},
            {'id': '7', 'name': '(GMT-05:00) Eastern Time (US & Canada)'},
            {'id': '8', 'name': '(GMT-05:00) Indiana (East)'}
          ]
        }
      };
      base.model.save('user', user);
      return;
    };
    saveModel();
  };

  var save = function () {
    base.model.save('user.username', 'supergirl22');
  };

  // return this factories services
  return {
    'service': {
      'save': save
    },
    'onready': {
      'api'   : apiEndpoint,
      'init'  : init,
      'extend': extend
    }
  };
}]);
