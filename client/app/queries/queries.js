'use strict';

angular.module('do6VsoBrowserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('queries', {
        url: '/project/:projectId',
        templateUrl: 'app/queries/queries.html',
        controller: 'QueriesCtrl',
        resolve: {
          projectId: function ($stateParams) {
            return $stateParams.projectId;
          }
        }
      });
  });