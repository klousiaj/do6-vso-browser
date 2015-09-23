'use strict';

angular.module('do6VsoBrowserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('queries.pbis', {
        url: '/:queryId',
        templateUrl: 'app/pbis/pbis.html',
        controller: 'PbisCtrl'
      });
  });