/* global siteApp */

siteApp.factory(
  'LoadExternal', ['$http', '$q', '$timeout', '$log', 'BaseSrvc', function ($http, $q, $timeout, $log, BaseSrvc) {
    var load = function (ajaxURI, lsKey, expDate) {
      var deferred = $q.defer();

      var base = BaseSrvc,
          data = base.ls.get('TemplatesCtrl:'+lsKey),
          log = base.log;

      //log('TemplatesCtrl:LoadExternal: "'+lsKey+'" value: '+data,'i');
      if (data!==undefined) deferred.resolve(data);
      else {
        $http.get(ajaxURI).then( function(response) {
          data = response.data;
          base.ls.set('TemplatesCtrl:'+lsKey, data, expDate);

          $timeout(function(){
            //log('TemplatesCtrl:LoadExternal: "'+lsKey+'" set in local storage: '+base.ls.get('TemplatesCtrl:'+lsKey),'i');
            deferred.resolve(data);
          });

        });
      };

      return deferred.promise;
    };

    return { load: load };
  }]);

siteApp.config(['$sceDelegateProvider', function ($sceDelegateProvider) 
{
  $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
}]);

siteApp.controller('TemplatesCtrl',
['$state', '$scope', 'BaseSrvc', 'Breadcrumbs', 'LoadExternal', 'appContent', 'appTemplates', '$uibModal', '$compile',
function($state, $scope, BaseSrvc, Breadcrumbs, LoadExternal, appContent, appTemplates, $uibModal, $compile) {

  Breadcrumbs.set([
    { text: 'AngularJS Dynamic Templates' }
  ]);

  // alias the Base Service
  $scope.base = BaseSrvc;
  var log = $scope.base.log;

  /**
   * appContent & appTemplates are created in the state's resolve paramter.
   * This ensures that the data is available before the controller is instantiated.
   * 
   * $scope.content is used in the ng-repeat of the contentItem directive.
   * Each item is passed into the directive using the content attribute.
   */
  $scope.content = appContent;
  $scope.templates = appTemplates;
  
  // Open a modal window that contains the notes for this view.
  $scope.openModal = function () {
    $uibModal.open({
      templateUrl: 'sections/templates/consumables/modal.html',
      appendTo: angular.element(document.querySelector('.ui-modal')),
      scope: $scope,
      size: 'lg'
    });
  };
  $scope.init = function () { $scope.openModal(); };

  // Demonstrates that the content added in directive is bound to the model
  $scope.changeModel = function() {
    $scope.content[0].title = 'London Bridge';
    $scope.content[0].description = 'Time lapse of the London Bridge';
    $scope.content[1].description = $scope.content[1].description.replace('Angular2','Angular 2');
    $scope.content[2].data += ' $scope.content model in TemplatesCtrl has been modified.';
  };

  // Demonstrates that the entire model can be replaced and the view changes accordingly
  $scope.loadNewModel = function() {
    LoadExternal.load( $state.current.data.ajaxBaseURI+'content2.json', 'content2', '1 min').then(function(result){
      $scope.content = result;
    });
  };

}]);

siteApp.directive('contentItem', ['$state', '$compile', function ($state, $compile)
{
  var linker = function (scope, element, attrs) {
    scope.rootDirectory = $state.current.data.imagePath;
    element.html(getTemplate(scope.$parent.templates, scope.content.content_type));
    $compile(element.contents())(scope);
  };
  
  var getTemplate = function (templates, contentType)
  {
    var template = '';

    switch (contentType) {
      case 'image':
        template = templates.imageTemplate;
        break;
      case 'video':
        template = templates.videoTemplate;
        break;
      case 'notes':
        template = templates.noteTemplate;
        break;
    }

    return template;
  };

  return {
    restrict: 'E',
    link: linker,
    scope: {
      content: '='
    }
  };
}]);
