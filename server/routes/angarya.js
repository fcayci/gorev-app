var express = require('express');
var router = express.Router();

const Gorev = require('../models/gorev');

router.get('/', function(req, res, next){
  res.send('ANGARYA PAGE');
});

/* title: Get every gorev in angarya
 *
 * return: angarya
 */
router.get('/angarya', function(req, res, next){
  Gorev.find(function (err, angarya) {
    if (err) return console.error(err);
    res.send(angarya);
  });
});

/* title: Add a gorev to angarya
 *
 * return: single person
 */
router.post('/angarya', function(req, res, next){
  console.log('[angarya.js] /angarya will be posted to create new gorev...');

// TOOD: Make approperiate checks for the candidate
  var candidate = req.body;
  console.log('[angarya.js] Candidate: ', candidate);

  var gorev = new Gorev(candidate);
  gorev.save(function(err){
    if (err) return console.error(err);
    console.log('[angarya.js] New gorev created...');
    res.status(200);
    res.json(gorev);
  });
});


module.exports = router;