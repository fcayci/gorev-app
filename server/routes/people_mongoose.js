var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/gtuee';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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
  var ifexists = 0;
  if (!person.fullname) {
    res.status(400);
    res.json({
      "error" : "Bad Data"
    });
  } else {
    db.gtueepeople.find( { fullname : { $exists: true, $in: [person.fullname] }}, function(err, people){
      if (err){
        res.send(err);
      } else{
        ifexists = people.length;
        console.log('[people.js] ifexists: ' + ifexists);
      }
    })

    if (ifexists == 0){
      db.gtueepeople.save(person, function(err, person){
        if (err){
          res.send(err);
        }
          res.json(person);
          console.log('[people.js] added' + person);
      })
    } else {
      console.log('[people.js] NOT added' + person);
    }
  }
})

// delete person
router.delete('/people/:id', function(req, res, next){
  db.gtueepeople.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, person){
    if (err){
      res.send(err);
    }
    res.json(person);
  })
})

// update @29:00

module.exports = router;