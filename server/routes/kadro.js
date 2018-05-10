var express = require('express');
var router = express.Router();

const OE = require('../models/ogretimelemani');
const Zaman = require('../models/zaman');

router.get('/', function(req, res, next){
  res.send('KADRO PAGE');
});

/* title: Get every person in kadro
 *
 * return: kadro
 */
router.get('/kadro', function(req, res, next){
  OE.find(function (err, kadro) {
    if (err) return console.error(err);
    //console.log(kadro);
    res.send(kadro);
  });
});

/* title: Get a single person by username
 *
 * return: single person
 */
router.get('/kadro/:username', function(req, res, next){
  OE.findOne({ 'username': req.params.username }, function (err, kisi) {
    if (err) return console.error(err);
    res.send(kisi);
  });
});

/* title: Add a person to kadro
 *
 * return: single person
 */
router.post('/kadro', function(req, res, next){
  console.log('[kadro.js] /kadro will be posted to create new kisi...');

// TOOD: Make approperiate checks for the candidate
  var candidate = req.body;
  console.log('[kadro.js] Candidate: ', candidate);

  if (!candidate.fullname || !candidate.email) {
    res.status(400);
    res.json({"error" : "Bad Data"});
  }
  else {
    candidate.username = candidate.email;

    var kisi = new OE(candidate);
    kisi.save(function(err){
      if (err) return console.error(err);
      console.log('[kadro.js] New kisi created...');
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
  console.log('[kadro.js] deleting kisi with username ', req.params.username, '...');

  OE.deleteOne({ 'username': req.params.username }, function (err, msg) {
    if (err) return console.error(err);
      console.log('[kadro.js] ', req.params.username, ' successfully deleted with msg...', msg);
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
  delete candidate.createdAt;

  console.log('[kadro.js] New candidate to update: id: ', id, 'candidate: ', candidate);

  OE.findByIdAndUpdate(id, req.body, {new: true}, (err, kisi) => {
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
  console.log('[kadro.js] adding to kisi with username', req.params.username, 'with the data', busy);

  OE.update({'username': req.params.username},
    { $push : {'busy' : busy} },
    function(err, msg){
      if (err) return console.error(err);
      console.log('[kadro.js]', req.params.username, 'updated successfully with msg...', msg);
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
  console.log('[kadro.js] updating kisi with username', req.params.username, 'with the data', busy, 'to remove');

  OE.update({'username': req.params.username},
    { $pull : {'busy' : busy} },
    function(err, msg){
      if (err) return console.error(err);
      console.log(msg);
      res.send(msg);
  });
});

module.exports = router;