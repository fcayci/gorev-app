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

/* title: Get busy times for a given owner _id
 *
 * return: Busy object
 */
router.get('/busy/:id', function(req, res, next) {
  Busy.find({ 'owner_id': mongoose.Types.ObjectId(req.params.id) }, function (err, busy) {
    if (err) return console.error(err);
    res.send(busy);
  });
});

/* title: Set a busy time for a given owner _id
 *
 * return: Busy object
 */
router.post('/busy/:id', function(req, res, next) {
  // TOOD: Make approperiate checks for the timeframe
  // if (!timeframe.owner_id){
  // }
  var timeframe = req.body;

  // Probably not needed since we use new below.
  var time = new Busy(timeframe);
  time.save(function(err){
    if (err) return console.error(err);
    res.status(200);
    res.json(time);
  });
});

/* title: Remove busy
 *
 * return: status msg
 */
router.delete('/busy/:id', function(req, res, next) {
  Busy.deleteOne({ '_id': req.params.id }, function (err, msg) {
    if (err) return console.error(err);
      res.send(msg);
  });
});

module.exports = router;