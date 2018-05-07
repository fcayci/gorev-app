var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/gtueepeople', ['gtueepeople'])

// get all users
router.get('/users', function(req, res, next){
  db.gtueepeople.find(function(err, users){
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
});

// get single user
router.get('/users/:id', function(req, res, next){
  db.gtueepeople.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, user){
    if (err) {
      res.send(err);
    }
      res.json(user);
  })
});

// save user
router.post('/users', function(req, res, next){
  var user = req.body;

  if (!user.fullname) {
    res.status(400);
    res.json({
      "error" : "Bad Data"
    });
  } else {
    db.gtueepeople.save(user, function(err, user){
      if (err){
        res.send(err);
      }
        res.json(user);
    });
  }
});

// delete user
router.delete('/users/:id', function(req, res, next){
  db.gtueepeople.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data){
    if (err){
      res.send(err);
    }
    res.json(data);
  });
});

// update user
router.put('/users/:id', function(req, res, next){
  var user = req.body;

  // remove _id before sending data.
  delete user._id;

  db.gtueepeople.update({_id: mongojs.ObjectId(req.params.id)}, user, {}, function(err, user){
    if (err){
      res.send(err);
    }
    res.json(user);
  });

});


module.exports = router;