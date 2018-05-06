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


module.exports = router;