'use strict';
/*global WorkItemList*/
angular.module('do6VsoBrowserApp')
  .controller('PbisCtrl', function (projectId, $scope, $http, $stateParams, $filter, uiGridConstants, $q) {

    var workItemList = new WorkItemList();

    $scope.types = {
      values: [],
      selected: []
    };
    $scope.assignees = {
      values: [],
      selected: []
    };
    
    // the gridOptions used to populate the ui-grid table
    $scope.gridOptions = {
      enableGridMenu: true,
      showGridFooter: true,
      showColumnFooter: true,
      exporterPdfDefaultStyle: { fontSize: 9 },
      exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
      exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
      exporterPdfHeader: { text: 'Work/User', style: 'headerStyle' },
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

    $scope.gridOptions.data = [];

    $scope.gridOptions.columnDefs = [
      { name: 'id', displayName: 'Id', width: 50, cellTooltip: true },
      { name: 'fields[\'System.WorkItemType\']', displayName: 'Type', width: 100, cellTooltip: true },
      { name: 'fields[\'System.Title\']', displayName: 'Title', cellTooltip: true },
      { name: 'points.planned', displayName: 'Points', width: 50, cellTooltip: true, aggregationType: uiGridConstants.aggregationTypes.sum },
      { name: 'work.planned', displayName: 'Planned Work', width: 50, cellTooltip: true, aggregationType: uiGridConstants.aggregationTypes.sum },
      { name: 'work.completed', displayName: 'Completed Work', width: 50, cellTooltip: true, aggregationType: uiGridConstants.aggregationTypes.sum },
      { name: 'work.remaining', displayName: 'Remaining Work', width: 50, cellTooltip: true, aggregationType: uiGridConstants.aggregationTypes.sum },
      { name: 'fields[\'Microsoft.VSTS.Common.ClosedDate\']', displayName: 'Closed Date', width: 100, cellTooltip: true },
      { name: 'assignee', displayName: 'Assignee', width: 100, cellTooltip: true, aggregationType: uiGridConstants.aggregationTypes.sum }
    ];

    // an array of promises that will be used to ensure that all of the data is available
    // before we do any summing of the data.
    var promiseArray = [];

    // execute the query specified by the user
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
            promiseArray = [];
            // set the assignees and the types
            $scope.assignees = workItemList.assignees;
            $scope.types = workItemList.types;
            // now that we have all of the workItems. We need to build out the relations for them
            populateRelations();
            var keys = Object.keys($filter('pbiTopLevel')(workItemList.workItems));
            // rollup all of the features children to calculate the work.
            rollupChildrensWork(keys, 0);

            $scope.updateTableData();
          });
        }
      });

    // update the data that is in the table based on the values selected in the select boxes.
    $scope.updateTableData = function () {
      $scope.gridOptions.data = [];
      // chain the filters. First thing, we need to pass in the pbiArray.
      $scope.gridOptions.data = $filter('pbiByAssigned')(Object.values(workItemList.workItems), $scope.assignees.selected);
      // then we need to pass in the tables array, that has already been filtered.
      $scope.gridOptions.data = $filter('pbiByType')($scope.gridOptions.data, $scope.types.selected);
    };
    
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
          workItemList.addWorkItem(item);
        });

      }).error(function (response) {
        console.log('failed to select pbi ' + response);
      }));
    };

    // populate the relations for each workItem. This is a translation from the URL to the ID and is used 
    // for all of the summing of points etc.
    var populateRelations = function () {
      Object.keys(workItemList.workItems).forEach(function (pbiId) {
        var workItem = workItemList.workItems[pbiId];
        if (typeof workItem.relations !== 'undefined') {
          workItem.relations.forEach(function (relation) {
            var relId = relation.url.substring(relation.url.lastIndexOf('/') + 1);
            // make sure that we only add those items that are returned in the query.
            if (typeof workItemList.workItems[relId] !== 'undefined') {
              if (workItemList.relationsList[relation.rel] === 'Parent') {
                workItem.parent = relId;
              } else if (workItemList.relationsList[relation.rel] === 'Child') {
                workItem.children.push(relId);
              }
            }
          });
        }
      });
    };
  
    // iterate through the list of features and roll up and points and hours underneath them.
    var rollupChildrensWork = function (children, parentId) {
      children.forEach(function (childId) {
        // make sure the child exists. Ignore it if it doesn't exist. The relationship didn't get selected 
        // in the query which means it was removed.
        if (typeof workItemList.workItems[childId] !== 'undefined') {
          // if the work item has children, then we need to add the childrens values to the parent
          if (workItemList.workItems[childId].children !== null) {
            rollupChildrensWork(workItemList.workItems[childId].children, childId);
          }
          if (parentId > 0) {
            // set the hours
            workItemList.workItems[parentId].work.planned += workItemList.workItems[childId].work.planned;
            workItemList.workItems[parentId].work.completed += workItemList.workItems[childId].work.completed;
            workItemList.workItems[parentId].work.remaining += workItemList.workItems[childId].work.remaining;
            // set the points
            workItemList.workItems[parentId].points.planned += workItemList.workItems[childId].points.planned;
            // check to see if the item is closed. Add it to the completed list if it has been.
            // this assumes that completed will always be equal to planned, which is different than the hours worked.
            if (workItemList.workItems[childId].fields['System.State'] === 'Closed') {
              workItemList.workItems[childId].points.completed = workItemList.workItems[childId].points.planned;
              workItemList.workItems[parentId].points.completed += workItemList.workItems[childId].points.planned;
            }
          }
        }
      });
    };
  });
