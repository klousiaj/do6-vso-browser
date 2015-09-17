'use strict';

angular.module('do6VsoBrowserApp')
  .controller('QueriesCtrl', function ($scope, $stateParams, $http) {
    $scope.queries = [];
    $http.get('/api/workitems/queries',
      {
        params: {
          project: $stateParams.projectId
        }
      }).success(function (queries) {
        $scope.queries = queries;
      });

  });
