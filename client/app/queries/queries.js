'use strict';

angular.module('do6VsoBrowserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('queries', {
        url: '/queries/:projectId',
        templateUrl: 'app/queries/queries.html',
        controller: 'QueriesCtrl'
      });
  });