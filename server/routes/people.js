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
    })
  }
})

// delete person
router.delete('peopel/:id', function(req, res, next){
  db.gtueepeople.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, person){
    if (err){
      res.send(err);
    }
    res.json(person);
  })
})

// update @29:00

module.exports = router;