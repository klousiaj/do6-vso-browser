'use strict';

angular.module('do6VsoBrowserApp')
  .controller('QueriesCtrl', function ($scope, $http) {
    $scope.queries = [];

    $http.get('/api/workitems/queries',
      {
        params: {
          project: $scope.projectId
        }
      }).success(function (queries) {
        $scope.queries = queries;
      });

  });
