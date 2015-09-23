'use strict';

angular.module('do6VsoBrowserApp')
  .controller('PbisCtrl', function (projectId, $scope, $http, $stateParams, $q) {
    $scope.pbis = [];

    $scope.types = {
      selected: [],
      values: []
    };
    
    $scope.assignees = {
      selected: [],
      values: []
    };

    // the gridOptions used to populate the ui-grid table
    $scope.gridOptions = {
      enableGridMenu: true,
      showGridFooter: true,
      showColumnFooter: true,
      exporterPdfDefaultStyle: { fontSize: 9 },
      exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
      exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
      exporterPdfHeader: { text: "Work/User", style: 'headerStyle' },
      exporterPdfFooter: function (currentPage, pageCount) {
        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
      },
      exporterPdfCustomFormatter: function (docDefinition) {
        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        return docDefinition;
      },
      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500
    };

    console.log('this is the PBIs controller');
    console.log('pbis projectId: ' + projectId);
    
    // an array of promises that will be used to ensure that all of the data is available
    // before we do any summing of the data.
    var promiseArray = [];

    $http.get('/api/workitems/query',
      {
        params: {
          query: $stateParams.queryId,
          project: projectId
        }
      }).success(function (response) {
        var workIds = [];
        if (typeof response.workItemRelations !== 'undefined') {
          response.workItemRelations.forEach(function (rec) {
            // the max number of ids you can submit in a single call is 200
            workIds.push(rec.target.id);
            if (workIds.length === 200) {
              selectPbis(workIds);
              workIds = [];
            }
          });
          if (workIds.length > 0) {
            selectPbis(workIds);
          }
          // now that all of the responses are back, go ahead and do the calculations.
          $q.all(promiseArray).then(function (response) {
            console.log('this needs to be fixed at some point.');
          });
        }
      });
    
    // select the PBI. Can take a single ID, or a comma separated list of IDs.
    var selectPbis = function (workItemId, asOf) {
      // push this promise onto the array of promises we are waiting for.
      promiseArray.push($http.get('/api/workitems/workitems', {
        params: {
          ids: workItemId,
          asOf: asOf
        }
      }).success(function (response) {
        // loop over each value in the response and add it to the list.
        response.forEach(function (item) {
          $scope.pbis.push(item);
        });
      }).error(function (response) {
        console.log('failed to select pbi ' + response);
      }));
    };
  });
