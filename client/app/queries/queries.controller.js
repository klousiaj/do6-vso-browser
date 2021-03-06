'use strict';

angular.module('do6VsoBrowserApp')
  .controller('QueriesCtrl', function ($scope, $stateParams, $http, $state) {
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

    $scope.value = 0; 

    // update the state according to the chosen queryId
    $scope.go = function (queryId) {
      var toParams = {
        queryId: queryId
      }
      $state.go('queries.pbis.data', toParams);
    }
  });
