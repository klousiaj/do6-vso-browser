'use strict';

var express = require('express');
var controller = require('./commits.controller');

var router = express.Router();

router.get('/repositories', controller.repositories);
router.get('/commits', controller.commits);

module.exports = router;