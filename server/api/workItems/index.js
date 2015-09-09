'use strict';

var express = require('express');
var controller = require('./workItems.controller');

var router = express.Router();

//router.get('/', controller.index);
router.get('/queries', controller.queries);

module.exports = router;