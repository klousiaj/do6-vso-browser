/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /workItems              ->  index
 * GET     /workItems/:id          ->  show
 */
'use strict';

var _ = require('lodash');
var webApiM = require('vso-node-api/WebApi');

var _bh = webApiM.getBasicHandler(process.env.USERNAME, process.env.PASSWORD);
var _vh = webApiM.getVersionHandler(1.0);
var _url = process.env.TFS_URL;
var _webApi = new webApiM.WebApi();

var _witApi = _webApi.getQWorkItemTrackingApi(_url, [_bh, _vh]);

var _queryList;
// the list of available fields. This is used to pass to the work item select
var _itemFields = [
  'System.Links.LinkType',
  'System.IterationPath',
  'System.IterationId',
  'System.TeamProject',
  'System.ProjectId',
  'System.AreaPath',
  'System.RevisedDate',
  'System.ChangedDate',
  'System.Id',
  'System.Title',
  'System.State',
  'System.AuthorizedDate',
  'System.ChangedBy',
  'System.AssignedTo',
  'System.WorkItemType',
  'System.CreatedDate',
  'System.CreatedBy',
  'System.RelatedLinks',
  'System.Description',
  'System.Tags',
  'Microsoft.VSTS.Scheduling.RemainingWork',
  'Microsoft.VSTS.Common.BacklogPriority',
  'Microsoft.VSTS.Common.Activity',
  'Microsoft.VSTS.Common.ClosedDate',
  'Microsoft.VSTS.Scheduling.Effort',
  'Microsoft.VSTS.Common.AcceptanceCriteria',
  'Microsoft.VSTS.Common.Severity',
  'Microsoft.VSTS.Common.ClosedBy',
  'Microsoft.VSTS.Common.StateCode',
  'Microsoft.VSTS.Common.ReviewedBy',
  'Microsoft.VSTS.Common.Issue',
  'Microsoft.VSTS.Common.StateChangeDate',
  'Microsoft.VSTS.Common.ActivatedDate',
  'Microsoft.VSTS.Common.ActivatedBy',
  'Microsoft.VSTS.Scheduling.TargetDate',
  'Microsoft.VSTS.Common.ResolvedDate',
  'Microsoft.VSTS.Common.ResolvedBy',
  'Microsoft.VSTS.Common.ResolvedReason',
  'Microsoft.VSTS.Scheduling.OriginalEstimate',
  'Microsoft.VSTS.Scheduling.CompletedWork',
  'Microsoft.VSTS.Scheduling.StartDate',
  'Microsoft.VSTS.Scheduling.FinishDate',
  'Microsoft.VSTS.Scheduling.StoryPoints'
];

// var populateItemFields = function() {
//   _witApi.getFields().done(function (response) {
//     response.forEach(function (field) {
//       _itemFields.push(field.referenceName);
//       console.log(field.referenceName);
//     });
//   });
// }

// populateItemFields();

/**
 * select the list of available queries.
 * @project: the project name
 */
exports.queries = function (req, res) {
  var project = req.query.project;
  _witApi.getQueries(project, 3, 2, false).done(function (response) {
    _queryList = [];
    response.forEach(function (branch) {
      processQueryTree(branch);
    })
    res.json(_queryList);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
};

/**
 * select a list of work items.
 * @ids: an array of workItem ids
 * @asOf: the date to start the query from
 */
exports.workitems = function (req, res) {
  var pbiIds = req.query.ids;
  var asOf = req.query.asOf || (new Date()).toISOString();
  _witApi.getWorkItems(pbiIds, null, asOf).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
}

/**
 * execute the specified query and reply with the resulting dataset.
 * @id: the queryId
 */
exports.query = function (req, res) {
  var queryId = req.query.query;
  var projectId = req.query.project;
  _witApi.queryById(queryId, projectId).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
}

/**
 * get the relation types available from the project site
 */
exports.relationtypes = function (req, res) {
  _witApi.getRelationTypes().done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
}

var processQueryTree = function (branch) {
  if (branch.hasChildren && typeof branch.children !== 'undefined') {
    branch.children.forEach(function (rec) {
      processQueryTree(rec);
    });
  } else if (typeof branch.isFolder === 'undefined') {
    _queryList.push(branch);
    // need to implement our own sort on this to compare the names for each of the queries.
    _queryList.sort(function (a, b) {
      return a.name < b.name ? -1 : 1;
    });
  }
};

