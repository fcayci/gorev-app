/*
 * kadro.js - This is where we keep all the information
 * about the people and their functions
 */

var express = require('express');
var router = express.Router();

const Faculty = require('../models/faculty');
const Busy = require('../models/busy');

var kisi = '';

/*
 * People list and their relative ranks
 * Other positions can be added
 */
const POSITIONS = [
	{'position': 'Dr.', 'rank': 10},
	{'position': 'Öğretim Görevlisi', 'rank': 20},
	{'position': 'Araştırma Görevlisi', 'rank': 30},
	{'position': 'Uzman', 'rank': 40},
	{'position': 'Memur', 'rank': 50},
	{'position': 'Diğer', 'rank': 100}
];

router.get('/', function(req, res, next){
	res.send('KADRO PAGE');
});

/*
 * Sistemde kayıtlı bütün kullanıcıların listesini çeker.
 * rank'a göre sıralar.
 *
 * @return Kullanıcı ve bilgilerinin listesi
 */
router.get('/kadro', function(req, res, next){

	Faculty.find(function (err, kadro) {
		if (err) return console.error(err);
		res.json(kadro);
		res.status(200);
		})
	.sort({ rank: 1 });
});

/*
 * Kullanıcı adı verilen kişiyi çeker. Eğer bulamazsa hata verir.
 *
 * @param username Kullanıcı adı (e-posta adı)
 * @return         Kullanıcı bilgileri
 */
router.get('/kadro/:username', function(req, res, next){

	if ( !req.params.username || req.params.username == 'undefined' ) {
		res.status(400);
		res.json({"error" : "Bad Data"});
	} else {
		Faculty.findOne({ 'username': req.params.username }, function (err, kisi) {
			if (err) return console.error(err);
			if (kisi) {
				res.json(kisi);
				res.status(200);
			} else {
				res.status(404);
				res.json({"error" : "Böyle bir kullanıcı mevcut değil."});
			}
		});
	}
});

/*
 * Yeni kullanıcı eklemek için kullanılır.
 * Kullanıcı FacultyModel şemasından olması lazımdır.
 * fullname / email / position bilgilerine ihtiyaç duyar
 *
 * @return Eklenen kullanıcı veya hata
 */
router.post('/kadro', function(req, res, next){

	// get the request body
	const candidate = req.body;

	// check if fullname / email and position are all there
	if ( !candidate.fullname || !candidate.email || !candidate.position ) {
		res.status(400);
		res.json("Eksik Bilgi...");
	} else {
		// set the username
		candidate.username = candidate.email;
		// create the kisi schema
		const kisi = new Faculty(candidate);

		// add rank object
		const r = POSITIONS.find(x => x.position === kisi.position);
		// if position is in the list, get its rank, otherwise just assign 100
		if (r) kisi.rank = r.rank;
		else kisi.rank = 100;

		// search for the given username, if it exists - give error and exit
		Faculty.findOne( { username: kisi.username }, function (err, resp) {
		if (err) return console.error(err);
			if (resp) {
				res.status(400);
				res.json(kisi.username + "@gtu.edu.tr sistemde zaten kayıtlı!");
			} else {
				// save kisi in the database and return the kisi object
				// TODO: query server for the newly created kisi, and make sure
				// it actually worked and matches the given person
				// TODO: add authentication
				kisi.save( function(err) {
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

/*
 * Kullanıcı adı verilen kişiyi siler.
 *
 * @param username Kullanıcı adı
 * @return         başarı mesajı veya hata
 */
router.delete('/kadro/:username', function(req, res, next){

	// check if the username is actually given
	if ( !req.params.username || req.params.username == 'undefined') {
		res.status(400);
		res.json({"error" : "Bad Data"});
	} else {
		// delete the given username from the database
		// TODO: add authentication
		// TODO: add check for tasks on the person
		// TODO: what to do about the current load?
		Faculty.deleteOne({ 'username': req.params.username }, function (err, msg) {
			if (err) return console.error(err);
			res.json(msg);
			res.status(200);
		});
	}
});

/*
 * kullanıcı adı verilen kişiyi günceller.
 *
 * @param username Kullanıcı adı
 * @return         başarı mesajı veya hata
 */
 // FIXME: go over this function
router.put('/kadro/:username', function(req, res, next){

	// get the request body and check if the email and username are given.
	// FIXME: why email?
	// FIXME: find a common request method
	const candidate = req.body;
	if ( !candidate || candidate == 'undefined' || !candidate.email || !candidate.username){
		res.status(400);
		res.json({"error" : "Bad Data"});
	} else {
		var query = { 'username' : candidate.username },
		options = { upsert: false, new: true }

		// add rank object
		const r = POSITIONS.find(x => x.position === candidate.position);
		if (r) { candidate.rank = r.rank; }
		else { candidate.rank = 100; }

		// Check if the email is changed.
		// FIXME: make it so that username/email cannot be changed
		if (candidate.email === candidate.username) {
			Faculty.findOneAndUpdate(query, candidate, options, (err, kisi) => {
				if (err) return console.error(err);
				res.json(kisi);
				res.status(200);
			});
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

/* 
 * Verilen görev(ler)i kullanıcıya ekler
 * görev JSON datası bekler
 *
 * @return status mesajı
 */
router.put('/kadro/:username/addtask', function(req, res, next){
	// get request body
	const task = req.body;

	// FIXME: check operation
	Faculty.update({'username': req.params.username},
		{ $push : {tasks : task._id},
		  $inc  : {load : task.load} 
		},
		function(err, msg) {
			if (err) return console.error(err);
			res.send(msg);
			res.status(200);
		}
	);
});

/* 
 * verilen görevleri kullanıcıdan siler
 * görev JSON datası bekler
 *
 * @return status mesajı
 */
router.put('/kadro/:username/deltask', function(req, res, next){
	// get request body
	const task = req.body;
	
	// FIXME: check operation
	Faculty.update({'username': req.params.username},
		{ $pull : {tasks : task._id},
		  $dec  : {load : task.load}
		},
		function(err, msg){
			if (err) return console.error(err);
			res.send(msg);
			res.status(200);
		}
	);
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

/*
 * compare json data and return the result
 * FIXME: move this to a common file
 * FIXME: test what it does. (probably working but just to make sure)
 */
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
