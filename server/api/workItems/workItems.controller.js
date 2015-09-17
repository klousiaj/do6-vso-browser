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

/**
 * select the list of available queries.
 * @project: the project name
 */
exports.queries = function (req, res) {
  var project = req.project || 'OjpApplicationMaintenance';
  _witApi.getQueries(project, 3, 2, false).done(function (response) {
    _queryList = [];
    response.forEach(function(branch){
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
 * @ids: a comma separated list of work item ids.
 * @asOf: the date to start the query from
 */
exports.workitems = function (req, res) {
  var pbiIds = req.ids;
  var asOf = req.asOf;
  _witApi.getWorkItems(pbiIds,null,asOf).done(function (response) {
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
  var queryId = req.id;
  _witApi.queryById(queryId, 'OjpApplicationMaintenance').done(function (response) {
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

