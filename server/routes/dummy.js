const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

// get all people
router.get('/dummy', function(req, res, next){
  axios.get(`${API}/users`)
    .then(people => {
      res.status(200).json(people.data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// get single person
router.get('/people/:id', function(req, res, next){

});

// save person
router.post('/people', function(req, res, next){
  var person = req.body;
  if (!person.name) {
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