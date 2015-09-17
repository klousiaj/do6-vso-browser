'use strict';

var _ = require('lodash');
var webApiM = require('vso-node-api/WebApi');

var _bh = webApiM.getBasicHandler(process.env.USERNAME, process.env.PASSWORD);
var _vh = webApiM.getVersionHandler(1.0);
var _url = process.env.TFS_URL;
var _webApi = new webApiM.WebApi();

var _gitApi = _webApi.getQGitApi(_url, [_bh, _vh]);

// Get list of repositories
exports.repositories = function(req, res) {
  var project = req.project || 'OjpApplicationMaintenance';
  _gitApi.getRepositories(project).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
};

// Get list of commits
exports.commits = function(req, res) {
  var repoId = req.repoId;
  var top = req.top || 15000;
  var project = req.project || 'OjpApplicationMaintenance';
  _gitApi.getRepositories(repoId,null,project,null,top).done(function (response) {
    res.json(response);
  },
    function (error) {
      console.log('failure: ' + error);
    }, function (err) {
      console.log('in progress');
    });
};