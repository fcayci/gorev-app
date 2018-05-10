var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/gtueepeople', ['gtueepeople'])

// get all kadro
router.get('/kadro', function(req, res, next){
  db.gtueepeople.find(function(err, kadro){
    if (err) {
      res.send(err);
    }
    res.json(kadro);
  });
});

// get single kisi
router.get('/kadro/:id', function(req, res, next){
  db.gtueepeople.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, kisi){
    if (err) {
      res.send(err);
    }
      res.json(kisi);
  })
});

// save kisi
router.post('/kadro', function(req, res, next){
  var kisi = req.body;

  if (!kisi.fullname) {
    res.status(400);
    res.json({
      "error" : "Bad Data"
    });
  } else {
    db.gtueepeople.save(kisi, function(err, kisi){
      if (err){
        res.send(err);
      }
        res.json(kisi);
    });
  }
});

// delete kisi
router.delete('/kadro/:id', function(req, res, next){
  db.gtueepeople.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data){
    if (err){
      res.send(err);
    }
    res.json(data);
  });
});

// update kisi
router.put('/kadro/:id', function(req, res, next){
  var kisi = req.body;

  // remove _id before sending data.
  delete kisi._id;

  db.gtueepeople.update({_id: mongojs.ObjectId(req.params.id)}, kisi, {}, function(err, kisi){
    if (err){
      res.send(err);
    }
    res.json(kisi);
  });

});


module.exports = router;