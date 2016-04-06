/* global siteApp */

siteApp.controller('AppCtrl', ['$scope', '$rootScope', 'Breadcrumbs', 'BaseSrvc', function($scope, $rootScope, Breadcrumbs, BaseSrvc)
{
  var vm = this;
      
  
  vm.showLoadingPanel = function() {
    if (!appStarting && BaseSrvc.ready) BaseSrvc.ready = false;
    BaseSrvc.ui.panel.open('appLoading', 'success', '<span class="strong">Loading...</span>');
  };
  
  vm.hideLoadingPanel = function() {
    if (!BaseSrvc.ready) BaseSrvc.ready = true;
    BaseSrvc.ui.panel.close('appLoading');
  };
  
  // page title
  $rootScope.$on('PageTitleSet', function(event, title) {
    $scope.pageTitle = title;
  });

  /**
   * AppCtrl offers all BaseSrvc services natively using the `app` var.
   * The root index.html file uses `ng-controller="AppCtrl as app"` in
   * the html tag which allows the `app` var to be used in:
   * Views: app.var
   * This controller: $scope.app.var
   * Other siteApp controllers: $scope.parent.app.var
   */
  $scope.$watch(function() { return BaseSrvc }, function(newVal,oldVal) {
    if (angular.equals(newVal,oldVal)) return;
    var k = Object.keys(BaseSrvc), l = k.length, i = 0;
    for(; i<l; i++) { if (angular.equals(vm[k[i]],BaseSrvc[k[i]])===false) { vm[k[i]] = BaseSrvc[k[i]]; } }
  }, true);

  // Show the appLoading panel as soon as its directive calls ui.panel.init().
  var appStarting     = true,
      clearPanelWatch = $scope.$watch(function() { return BaseSrvc.ui.panel.data }, function(data) {
        if (data['appLoading'] !== undefined) {
          vm.showLoadingPanel();
          clearPanelWatch();
        }
      }, true),
      clearReadyWatch = $scope.$watch('app.ready', function(appReady) {
        if (appReady) {
          appStarting = false;
          vm.hideLoadingPanel();
          clearReadyWatch();
        }
      });

  // breadcrumbs
  $scope.breadcrumbs = false;
  $scope.$watch(function() { return Breadcrumbs.get(); }, function(newVal) {
    $scope.breadcrumbs = newVal;
  }, true);

  // DrillSrvc testing
  $scope.counter = 0;
  $scope.increment = function() {
    $scope.counter++;
  };

}]);