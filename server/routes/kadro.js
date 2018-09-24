var express = require('express');
var router = express.Router();

const Faculty = require('../models/faculty');
const Busy = require('../models/busy');

var kisi = '';

router.get('/', function(req, res, next){

  res.send('KADRO PAGE');
});

/**
 * Sistemde kayıtlı bütün kullanıcıların listesini çağır.
 *
 * @return Kullanıcı ve bilgilerinin listesi
 */
router.get('/kadro', function(req, res, next){

  Faculty.find(function (err, kadro) {
    if (err) return console.error(err);
    res.json(kadro);
    res.status(200);
  });
});

/**
 * Kullanıcı adı verilen kişiyi çağır. Eğer bulamazsa hata verir.
 *
 * @param username Kullanıcı adı (e-posta adı)
 * @return         Kullanıcı bilgileri
 */
router.get('/kadro/:username', function(req, res, next){

  if (!req.params.username || req.params.username == 'undefined') {
    res.status(400);
    res.json({"error" : "Bad Data"});
  } else {
    Faculty.findOne({ 'username': req.params.username }, function (err, kisi) {
      if (err) return console.error(err);
      res.json(kisi);
      res.status(200);
      kisi = kisi;
    });
  }
});

/**
 * Verilen kullanıcıyı ekler. 
 * Kullanıcı FacultySchema şemasından olması lazımdır.
 *
 * @return Eklenen kullanıcı veya hata
 */
router.post('/kadro', function(req, res, next){

  const candidate = req.body;

  if (!candidate.fullname || !candidate.email || !candidate.position) {
    res.status(400);
    res.json("Eksik Bilgi!");
  }
  else {
    candidate.username = candidate.email;
    const kisi = new Faculty(candidate);

    Faculty.findOne( { username: kisi.username }, function (err, resp) {
      if (err) return console.error(err);
      if (resp) {
        res.status(400);
        res.json(kisi.username + "@gtu.edu.tr sistemde zaten kayıtlı!");
      } else {
        kisi.save(function(err) {
          if (err) {
            res.status(400);
            res.json(err.message);
          } else {
            res.status(200);
            res.json(kisi);
          }
        });
      }
    });
  }
});

/**
 * Kullanıcı adı verilen kullanıcıyı siler.
 * 
 * @param username Kullanıcı adı
 * @return         başarı mesajı veya hata
 */
router.delete('/kadro/:username', function(req, res, next){

  if (!req.params.username || req.params.username == 'undefined') {
    res.status(400);
    res.json({"error" : "Bad Data"});
  } else {
    Faculty.deleteOne({ 'username': req.params.username }, function (err, msg) {
      if (err) return console.error(err);
        res.json(msg);
        res.status(200);
    });
  }
});

/**
 * kullanıcı adı verilen kullanıcıyı günceller.
 * 
 * @param username Kullanıcı adı
 * @return         başarı mesajı veya hata
 */
router.put('/kadro/:username', function(req, res, next){

  const candidate = req.body;

  if (!candidate || candidate == 'undefined' || !candidate.email || !candidate.username){
    res.status(400);
    res.json({"error" : "Bad Data"});
  } else {
    var query = { 'username' : candidate.username },
        options = { upsert: false, new: true }

    // Check if the email is changed.
    if (candidate.email === candidate.username) {

      Faculty.findOneAndUpdate(query, candidate, options, (err, kisi) => {
        if (err) return console.error(err);
        res.json(kisi);
        res.status(200);
      })
    } else {
      Faculty.findOne({'email' : candidate.email}, (err, resp) => {
        if (err) return console.error(err);
        if (resp) {
          res.status(400);
          res.json(candidate.email + "@gtu.edu.tr sistemde kayıtlı!");
        } else {
          // Update username to match the email and save the result
          candidate.username = candidate.email;
          Faculty.findOneAndUpdate(query, candidate, options, (err, kisi) => {
            if (err) return console.error(err);
            res.json(kisi);
            res.status(200);
          })
        }
      });
    }
  }
});

/* title: Add to tasks array of the passed username
 * Expects task JSON data
 *
 * return: status msg
 */
router.put('/kadro/:username/addtask', function(req, res, next){
  const task = req.body;

  Faculty.update({'username': req.params.username},
    { $push : {tasks : task._id},
      $inc : {load : task.load} },
    function(err, msg){
      if (err) return console.error(err);
      res.send(msg);
      res.status(200);
  });
});

/* title: Add to tasks array of the passed username
 * Expects task JSON data
 *
 * return: unknown
 */
router.put('/kadro/:username/deltask', function(req, res, next){
  const task = req.body;

  Faculty.update({'username': req.params.username},
  { $pull : {tasks : task._id},
    $dec : {load : task.load} },
    function(err, msg){
      if (err) return console.error(err);
      res.send(msg);
      res.status(200);
  });
});

/* title: Remove from busy array of the passed username.
 * Expects busy JSON data
 *
 * return: unknown
 */
// router.put('/kadro/:username', function(req, res, next){
//   // TOOD: Make approperiate checks for the busy
//   // busy should be in ObjectId('id') format
//   var busy = req.body;

//   Faculty.update({'username': req.params.username},
//     { $pull : {'busy' : busy} },
//     function(err, msg){
//       if (err) return console.error(err);
//       res.send(msg);
//   });
// });


function compareJSON(obj1, obj2) {
  const ret = {};
  for (const i in obj2) {
    if (!i.startsWith('__')) {
      if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
        ret[i] = obj2[i];
      }
    }
  }
  return ret;
};

module.exports = router;