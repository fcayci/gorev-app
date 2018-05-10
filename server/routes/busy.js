var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const OE = require('../models/ogretimelemani');
const Zaman = require('../models/zaman');

router.get('/', function(req, res, next){
  res.send('BUSY PAGE');
});

/* title: Get all the busy times in the universe.
 *
 * return: busy array
 */
router.get('/busy', function(req, res, next){
  Zaman.find(function (err, busy){
    if (err) return console.error(err);
    res.status(200);
    res.json(busy);
  });
});

/* title: Get busy times for a given owner _id
 *
 * return: busy object
 */
router.get('/busy/:id', function(req, res, next){
  Zaman.find({ 'owner_id': mongoose.Types.ObjectId(req.params.id) }, function (err, busy) {
    if (err) return console.error(err);
    res.send(busy);
  });
});

/* title: Set a busy time for a given owner _id
 *
 * return: unknown
 */
router.post('/busy/:id', function(req, res, next){

  // TOOD: Make approperiate checks for the timeframe
  // TODO: Prevent duplicates
  var timeframe = req.body;
  console.log('[gtuee]', timeframe)

  // Probably not needed since we use new below.
  delete timeframe._id;
  var time = new Zaman(timeframe);
  time.save(function(err){
    if (err) return console.error(err);
    res.status(200);
    res.json(time);
  });
});


module.exports = router;