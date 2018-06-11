var express = require('express');
var router = express.Router();

const Faculty = require('../models/faculty');
const Busy = require('../models/busy');

router.get('/', function(req, res, next){
  res.send('KADRO PAGE');
});

/* title: Get every person in kadro
 *
 * return: kadro
 */
router.get('/kadro', function(req, res, next){
  Faculty.find(function (err, kadro) {
    if (err) return console.error(err);
    res.send(kadro);
  });
});

/* title: Get a single person by username
 *
 * return: single person
 */
router.get('/kadro/:username', function(req, res, next){
  Faculty.findOne({ 'username': req.params.username }, function (err, kisi) {
    if (err) return console.error(err);
    res.send(kisi);
  });
});

/* title: Add a person to kadro
 *
 * return: single person
 */
router.post('/kadro', function(req, res, next){

// TOOD: Make approperiate checks for the candidate
  var candidate = req.body;

  if (!candidate.fullname || !candidate.email) {
    res.status(400);
    res.json({"error" : "Bad Data"});
  }
  else {
    candidate.username = candidate.email;

    var kisi = new Faculty(candidate);
    kisi.save(function(err){
      if (err) return console.error(err);
      res.status(200);
      res.json(kisi);
    });
  }
});

/* title: Remove single person from kadro matching the username.
 *
 * return: status msg
 */
router.delete('/kadro/:username', function(req, res, next){

  Faculty.deleteOne({ 'username': req.params.username }, function (err, msg) {
    if (err) return console.error(err);
      res.send(msg);
  });
});

/* title: Update kisi with username matcing the _id
 * Expects full JSON of the candidate.
 *
 * return: unknown
 */
router.put('/kadro/:username', function(req, res, next){

  // TOOD: Make approperiate checks for the candidate
  // TODO: Better way?
  var candidate = req.body;
  var id = candidate._id;

  // new: true makes it return the updated kisi object.
  Faculty.findByIdAndUpdate(id, candidate, {new: true}, (err, kisi) => {
    if (err) return console.error(err);
    return res.send(kisi);
  })
});

/* title: Add to busy array of the passed username.
 * Expects busy JSON data
 *
 * return: unknown
 */
router.put('/kadro/:username', function(req, res, next){
  // TOOD: Make approperiate checks for the busy
  // busy should be in ObjectId('id') format
  var busy = req.body;

  Faculty.update({'username': req.params.username},
    { $push : {'busy' : busy} },
    function(err, msg){
      if (err) return console.error(err);
      res.send(msg);
  });
});

/* title: Remove from busy array of the passed username.
 * Expects busy JSON data
 *
 * return: unknown
 */
router.put('/kadro/:username', function(req, res, next){
  // TOOD: Make approperiate checks for the busy
  // busy should be in ObjectId('id') format
  var busy = req.body;

  Faculty.update({'username': req.params.username},
    { $pull : {'busy' : busy} },
    function(err, msg){
      if (err) return console.error(err);
      res.send(msg);
  });
});

module.exports = router;