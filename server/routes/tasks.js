var express = require('express');
var router = express.Router();

const Gorev = require('../models/gorev');

router.get('/', function(req, res, next){
  res.send('TASK PAGE');
});

/* title: Get every task in tasks
 *
 * return: tasks
 */
router.get('/tasks', function(req, res, next){
  Gorev.find(function (err, tasks) {
    if (err) return console.error(err);
    res.send(tasks);
  });
});

module.exports = router;