/* global dashApp */

// DASHBOARD SERVICE
dashApp.factory('DashboardSrvc',
  ['DataService', 'httpService', 'FilterSrvc', 'ChartSrvc', 'LayoutSrvc', 'PresetsSrvc', 'CstmViewsSrvc', 'SnapshotsSrvc', 'UserSrvc',
  function(DataService, httpService, FilterSrvc, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc)
{
  // everything in service is made available to the AppController
  var service = {};
  angular.extend(service, DataService, FilterSrvc, ChartSrvc, LayoutSrvc, PresetsSrvc, CstmViewsSrvc, SnapshotsSrvc, UserSrvc);
  
  // this keeps the regex from getting slaughtered
  service.pattern = service.getPattern();
  
  return service;
}]);
