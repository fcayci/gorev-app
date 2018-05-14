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

/* title: Get gorev
 *
 * return: angarya/gorev - depending on owner_id or _id
 */
router.get('/angarya/:id', function(req, res, next){
  Gorev.findOne({ '_id': req.params.id }, function (err, gorev) {
    if (err) return console.error(err);
    res.send(gorev);
  });
});


/* title: Add a gorev to angarya
 *
 * return: single person
 */
router.post('/angarya', function(req, res, next){

  // TOOD: Make approperiate checks for the candidate
  var candidate = req.body;

  var gorev = new Gorev(candidate);
  gorev.save(function(err){
    if (err) return console.error(err);
    res.status(200);
    res.json(gorev);
  });
});


/* title: Remove task by id
 *
 * return: status msg
 */
router.delete('/angarya/:id', function(req, res, next){

  Gorev.deleteOne({ '_id': req.params.id }, function (err, msg) {
    if (err) return console.error(err);
      res.send(msg);
  });
});

module.exports = router;