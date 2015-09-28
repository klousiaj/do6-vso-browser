'use strict';

angular.module('do6VsoBrowserApp')
// filter the overall list by the types provided. The pbiType is an array of possible types.
  .filter('pbiByType', function () {
    return function (workItemList, pbiType) {
      var filteredList = [];
      for (var ii = 0; ii < workItemList.length; ii++) {
        if (pbiType.length === 0 || pbiType.indexOf(workItemList[ii].fields['System.WorkItemType']) > -1) {
          filteredList.push(workItemList[ii]);
        }
      }
      return filteredList;
    };
    // filter the list of PBIs by the assignee. authors is an array of assignees
  }).filter('pbiByAssigned', function () {
    return function (workItemList, authors) {
      var filteredList = [];
      for (var ii = 0; ii < workItemList.length; ii++) {
        if (authors.length === 0 || authors.indexOf(workItemList[ii].assignee) > -1) {
          filteredList.push(workItemList[ii]);
        }
      }
      return filteredList;
    };
  }).filter('pbiTopLevel', function () {
    return function (pbiList) {
      var filteredList = {};
      Object.keys(pbiList).forEach(function (pbiId) {
        var workItem = pbiList[pbiId];
        if (workItem.parent === 0) {
          filteredList[pbiId] = pbiList[pbiId];
        }
      });
      return filteredList;
    };
  });
