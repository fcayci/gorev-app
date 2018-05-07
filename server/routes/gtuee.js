var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var OE = require('../models/ogretimelemani');
var Gorev = require('../models/gorev');

var mongoDB = 'mongodb://127.0.0.1:27017/gtuee';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// get all people
router.get('/people', function(req, res, next){
  OE.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
    res.send(users);
  });
});

// add person
router.post('/people', function(req, res, next){
  console.log('[gtuee.js] /people will be posted to create new user...');

  var candidate = req.body;
  console.log('[gtuee]', candidate)

  if (!candidate.fullname) {
    res.status(400);
    res.json({"error" : "Bad Data"});
  } else {
    var user = new OE(candidate);
    user.save(function(err){
      if (err) return console.error(err);
      res.status(200);
      res.json(user);
    });
  }
});

module.exports = router;