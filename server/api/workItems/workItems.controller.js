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

/**
 * select the list of available queries
 */
exports.queries = function (req, res) {
  var site = req.site;
  _witApi.getQueries(site, 3, 2, false).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
};

/**
 * select a list of work items.
 */
exports.workitem = function (req, res) {
  _witApi.getWorkItems('OjpApplicationMaintenance', 3, 2, false).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
}

/**
 * 
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

