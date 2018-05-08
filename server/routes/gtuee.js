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
router.get('/kadro', function(req, res, next){
  OE.find(function (err, kadro) {
    if (err) return console.error(err);
    console.log(kadro);
    res.send(kadro);
  });
});

// get single kisi
router.get('/kadro/:username', function(req, res, next){
  OE.findOne({ 'username': req.params.username }, function (err, kisi) {
    if (err) return console.error(err);
    console.log(kisi);
    res.send(kisi);
  });
});


// add kisi
router.post('/kadro', function(req, res, next){
  console.log('[gtuee.js] /kadro will be posted to create new kisi...');

  var candidate = req.body;
  // TODO: remove this for production
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
router.delete('/kadro/:username', function(req, res, next){
  console.log('[gtuee.js] deleting', req.params.username, '...');

  OE.deleteOne({ 'username': req.params.username }, function (err, msg) {
    if (err) return console.error(err);
      console.log(msg);
      res.send(msg);
  });
});



module.exports = router;