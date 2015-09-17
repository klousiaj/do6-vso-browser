'use strict';

var _ = require('lodash');
var webApiM = require('vso-node-api/WebApi');

var _bh = webApiM.getBasicHandler(process.env.USERNAME, process.env.PASSWORD);
var _vh = webApiM.getVersionHandler(1.0);
var _url = process.env.TFS_URL;
var _webApi = new webApiM.WebApi();

var _coreApi = _webApi.getQCoreApi(_url, [_bh, _vh]);

// Get list of projects
exports.index = function(req, res) {
  _coreApi.getProjects().done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
};

/**
 * get a list of teams associated with the provided 
 */
exports.teams = function(req, res){
   var projectId = req.projectId || process.env.DEFAULT_PROJECT_ID;
  _coreApi.getTeams(projectId).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    }); 
}

/**
 * get the list of team members for the provided project team.
 */
exports.teammembers = function(req, res) {
  var projectId = req.projectId || process.env.DEFAULT_PROJECT_ID;
  var teamId = req.teamId || '7707ecb0-cbb6-4b1a-8d30-2dbe3a600c41';
  _coreApi.getTeamMembers(projectId, teamId).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
};