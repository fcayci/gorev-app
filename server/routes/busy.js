var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Faculty = require('../models/faculty');
const Busy = require('../models/busy');

router.get('/', function(req, res, next){
  res.send('BUSY PAGE');
});

/* title: Get all the busy times in the universe.
 *
 * return: Array of Busy
 */
router.get('/busy', function(req, res, next) {
  Busy.find(function (err, busy){
    if (err) return console.error(err);
    res.status(200);
    res.json(busy);
  });
});

/* title: Get busy for a given type/id pair
 *
 * return: Busy object
 */
router.get('/busy/:type/:id', function(req, res, next) {
  var type = req.params.type
  var id = req.params.id
  if (!type || type == 'undefined'){
    res.status(400);
    res.json({"error" : "Bad Data"});
  }
  else if (!id || id == 'undefined') {
    res.status(400);
    res.json({"error" : "Bad Data"});
  }
  
  if (type == 'owner') {
    Busy.find({ 'owner_id': mongoose.Types.ObjectId(id) }, function (err, busy) {
      if (err) return console.error(err);
      res.json(busy);
      res.status(200);
    });
  } else if (type == 'task') {
    Busy.find({ 'task_id': mongoose.Types.ObjectId(id) }, function (err, busy) {
      if (err) return console.error(err);
      res.json(busy);
      res.status(200);
    });
  } else {
    res.status(400);
    res.json('{"error" : "Bad Data"}')
  }
});

/* title: Create a busy time
 *
 * return: Busy object
 */
router.post('/busy', function(req, res, next) {
  var candidate = req.body;
  if (!candidate) {
    res.status(400);
    res.json({"error" : "No Data"});
  }

  if (!candidate.owner_id) {
    res.status(400);
    res.json({"error" : "Bad Data"});
  }
  else {
    var time = new Busy(candidate);

    time.save(function(err){
      if (err) return console.error(err);
      res.status(200);
      res.json(time);
    });
  }
});

/* title: Remove busy
 *
 * return: status msg
 */
router.delete('/busy/:id', function(req, res, next) {
  if (!req.params.id || req.params.id == 'undefined') {
    res.status(400);
    res.json({"error" : "No Data"});
  } else {
    Busy.deleteOne({ '_id': req.params.id }, function (err, msg) {
      if (err) return console.error(err);
        res.send(msg);
        res.status(200);
    });
  }
});

module.exports = router;