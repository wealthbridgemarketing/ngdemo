/* global siteApp */

siteApp.controller('XferCtrl', ['$scope', 'Breadcrumbs', function($scope, Breadcrumbs) {

  Breadcrumbs.set([
    { text: 'Transfer Cash' }
  ]);

  // default values are make everything easier
  var dflts = {
    AMT:  null,
    TXT: '',
    DTE: '',
    NTC:  false,
    ERR:  false
  };

  // define the scope vars based on the default vars
  $scope.xfer = {
    amt: dflts.AMT,
    txt: dflts.TXT,
    dte: dflts.DTE,
    ntc: dflts.NTC,
    err: dflts.ERR
  };

  // transfer function where all the magic happens
  $scope.doCashTransfer = function(valid) 
  {
    if ( valid && parseInt($scope.xfer.amt) > 0 ) {
      $scope.xfer.err = dflts.ERR;
      $scope.xfer.txt = $scope.xfer.amt;

      $scope.xfer.dte = new Date();
      $scope.xfer.ntc = true;
    } 
    else {
      $scope.xfer.ntc = dflts.NTC;
      $scope.xfer.txt = dflts.TXT;
      $scope.xfer.dte = dflts.DTE;

      $scope.xfer.err = valid ? 'Invalid Amount' : 'Missing Amount';
    }

    $scope.xfer.amt = dflts.AMT;
  };

}]);
  