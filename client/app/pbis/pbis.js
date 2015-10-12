'use strict';

angular.module('do6VsoBrowserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('queries.pbis', {
        abstract: true,
        templateUrl: 'app/pbis/pbis.html',
        controller: 'PbisCtrl'
      }).state('queries.pbis.data', {
        url: '/:queryId',
        views: {
          'pbisTable': {
            templateUrl: 'app/pbis/pbisTable.html'
          },
          'featureChart': {
            templateUrl: 'app/featureChart/featureChart.html',
            controller: 'FeatureChartCtrl'
          }
        }
      });
  });