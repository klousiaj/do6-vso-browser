'use strict';

angular.module('do6VsoBrowserApp')
  .controller('QueriesCtrl', function ($scope, $stateParams, $http) {
    $scope.queries = [];
    $scope.projectId = $stateParams.projectId;
    $http.get('/api/workitems/queries',
      {
        params: {
          project: $scope.projectId
        }
      }).success(function (queries) {
        $scope.queries = queries;
      });
  });
