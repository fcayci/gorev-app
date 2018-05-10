var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const OE = require('../models/ogretimelemani');
const Gorev = require('../models/gorev');
const Zaman = require('../models/zaman');

var mongoDB = 'mongodb://127.0.0.1:27017/gtuee';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// get all kadro
// return kadro
router.get('/kadro', function(req, res, next){
  OE.find(function (err, kadro) {
    if (err) return console.error(err);
    //console.log(kadro);
    res.send(kadro);
  });
});


// get single kisi
// return kisi
router.get('/kadro/:username', function(req, res, next){
  OE.findOne({ 'username': req.params.username }, function (err, kisi) {
    if (err) return console.error(err);
    res.send(kisi);
  });
});


// get single kisi busy time
// return time
router.get('/busy/:id', function(req, res, next){
  Zaman.find({ 'owner_id': mongoose.Types.ObjectId(req.params.id) }, function (err, busy) {
    if (err) return console.error(err);
    res.send(busy);
  });
});


// add kisi
// TODO: add validation
router.post('/kadro', function(req, res, next){
  console.log('[gtuee.js] /kadro will be posted to create new kisi...');

// TOOD: Make approperiate checks for the candidate
  var candidate = req.body;
  console.log('[gtuee]', candidate)

  if (!candidate.fullname || !candidate.email) {
    res.status(400);
    res.json({"error" : "Bad Data"});
  }
  else {
    candidate.username = candidate.email;

    var kisi = new OE(candidate);
    kisi.save(function(err){
      if (err) return console.error(err);
      res.status(200);
      res.json(kisi);
    });
  }
});


// remove kisi
// return status msg
router.delete('/kadro/:username', function(req, res, next){
  console.log('[gtuee.js] deleting', req.params.username, '...');

  OE.deleteOne({ 'username': req.params.username }, function (err, msg) {
    if (err) return console.error(err);
      console.log(msg);
      res.send(msg);
  });
});


// update kisi
router.put('/kadro/:username', function(req, res, next){
  console.log('[gtuee.js] updating', req.params.username, '...');

  // TOOD: Make approperiate checks for the candidate
  var candidate = req.body;
  var id = candidate._id;
  delete candidate._id;
  console.log('[gtuee]', id, candidate);

  // FIXME: Seems working, but not actually working.
  // Probably the rest will not work as well.
  OE.update({ _id: id},
    { $set : { candidate } },
    function(err, msg){
      if (err) return console.error(err);
      console.log(msg);
      res.send(msg);
  });
});


// Add to busy array
router.put('/kadro/:username', function(req, res, next){
  console.log('[gtuee.js] adding to ', req.params.username, '...');

  // TOOD: Make approperiate checks for the busy
  // busy should be in ObjectId('id') format
  var busy = req.body;
  console.log('[gtuee]', busy)

  OE.update({'username': req.params.username},
    { $push : {'busy' : busy} },
    function(err, msg){
      if (err) return console.error(err);
      console.log(msg);
      res.send(msg);
  });
});


// Remove from busy array
router.put('/kadro/:username', function(req, res, next){
  console.log('[gtuee.js] updating', req.params.username, '...');

  // TOOD: Make approperiate checks for the busy
  // busy should be in ObjectId('id') format
  var busy = req.body;
  console.log('[gtuee]', busy)

  OE.update({'username': req.params.username},
    { $pull : {'busy' : busy} },
    function(err, msg){
      if (err) return console.error(err);
      console.log(msg);
      res.send(msg);
  });
});


module.exports = router;