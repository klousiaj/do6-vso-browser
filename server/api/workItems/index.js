'use strict';

var express = require('express');
var controller = require('./workItems.controller');

var router = express.Router();

//router.get('/', controller.index);
router.get('/queries', controller.queries);
router.get('/workitems', controller.workitems);
router.get('/query', controller.query);
router.get('/relationtypes', controller.relationtypes);

module.exports = router;