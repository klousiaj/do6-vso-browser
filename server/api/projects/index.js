'use strict';

var express = require('express');
var controller = require('./projects.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/teammembers', controller.teammembers);
router.get('/teams', controller.teams);

module.exports = router;