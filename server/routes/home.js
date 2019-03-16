/*
 * home.js - currently just an empty place 
 * navigation stuff / personal info can be added he
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.send('INDEX PAGE');
});

module.exports = router;
