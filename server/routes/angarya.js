var express = require('express');
var router = express.Router();

const Task = require('../models/task');

router.get('/', function(req, res, next){
  res.send('ANGARYA PAGE');
});

/* title: Get every gorev in angarya
 *
 * return: angarya
 */
router.get('/angarya', function(req, res, next){
  Task.find(function (err, angarya) {
    if (err) return console.error(err);
    res.send(angarya);
    res.status(200);
  });
});

/* title: Get open gorev in angarya
 *
 * return: angarya
 */
router.get('/angarya/open', function(req, res, next){
  Task.find({ 'status': 0 }, function (err, angarya) {
    if (err) return console.error(err);
    res.send(angarya);
    res.status(200);
  });
});

/* title: Get closed gorev in angarya
 *
 * return: angarya
 */
router.get('/angarya/closed', function(req, res, next){
  Task.find({ 'status': 1 }, function (err, angarya) {
    if (err) return console.error(err);
    res.send(angarya);
    res.status(200);
  });
});

/* title: Get gorev
 *
 * return: an array of angarya/gorev given id(s)
 */
router.get('/angarya/:id', function(req, res, next){
  if (!req.params.id || req.params.id == 'undefined'){
    res.status(200);
    res.json({"error" : "No Data"});
  } else {
    const ids = req.params.id.split(',');
    Task.find({ '_id': {$in: ids} }, function (err, gorev) {
      if (err) return console.error(err);
      res.send(gorev);
      res.status(200);
    });
  }
});


/* title: Add a gorev to angarya
 *
 * return: single person
 */
router.post('/angarya', function(req, res, next){
  console.log(req.body)
  // TOOD: Make approperiate checks for the candidate
  var candidate = req.body;
  if (!candidate || candidate == 'undefined'){
    res.status(400);
    res.json({"error" : "Bad Data"});
  } else {
    var gorev = new Task(candidate);
    gorev.save(function(err){
      if (err) return console.error(err);
      res.status(200);
      res.json(gorev);
    });
  }
});


/* title: Remove task by id
 *
 * return: status msg
 */
router.delete('/angarya/:id', function(req, res, next){
  if(!req.params.id || req.params.id == 'undefined') {
    res.status(400);
    res.json({"error" : "Bad Data"});
  } else {
    Task.deleteOne({ '_id': req.params.id }, function (err, msg) {
      if (err) return console.error(err);
        res.send(msg);
        res.status(200);
    });
  }
});

module.exports = router;