var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/gtueepeople', ['gtueepeople'])

// get all people
router.get('/people', function(req, res, next){
  db.gtueepeople.find(function(err, people){
    if (err) {
      res.send(err);
    }
    res.json(people);
  });
});

// get single person
router.get('/people/:id', function(req, res, next){
  db.gtueepeople.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, person){
    if (err) {
      res.send(err);
    }
      res.json(person);
  })
});

// save person
router.post('/people', function(req, res, next){
  var person = req.body;

  if (!person.fullname) {
    res.status(400);
    res.json({
      "error" : "Bad Data"
    });
  } else {
    db.gtueepeople.save(person, function(err, person){
      if (err){
        res.send(err);
      }
        res.json(person);
    });
  }
});

// delete person
router.delete('/people/:id', function(req, res, next){
  db.gtueepeople.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data){
    if (err){
      res.send(err);
    }
    res.json(data);
  });
});

// update person
router.put('/people/:id', function(req, res, next){
  var person = req.body;

  // remove _id before sending data.
  delete person._id;

  db.gtueepeople.update({_id: mongojs.ObjectId(req.params.id)}, person, {}, function(err, person){
    if (err){
      res.send(err);
    }
    res.json(person);
  });

});


module.exports = router;