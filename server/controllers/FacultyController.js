var FacultyModel = require('../models/FacultyModel.js');

/**
 * FacultyController.js
 *
 * @description :: Server-side logic for managing Facultys.
 */
module.exports = {

	/**
	 * FacultyController.list()
	 *
	 * Sistemde kayıtlı bütün kullanıcıların listesini çekerç
	 * rank'a göre sıralar
	 *
	 */
	list: function (req, res) {
		FacultyModel.find(function (err, Facultys) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Faculty',
					error: err
				});
			}
			return res.json(Facultys)
		})
		.sort({rank: 1});
	},

	/**
	 * FacultyController.show()
	 *
	 * Kullanıcı IDsi verilen kişiyi çeker.
	 */
	show: function (req, res) {
		var id = req.params.id;
		FacultyModel.findOne({_id: id}, function (err, Faculty) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Faculty',
					error: err
				});
			}
			if (!Faculty) {
				return res.status(404).json({
					message: 'No such Faculty'
				});
			}
			return res.json(Faculty);
		});
	},

	/**
	 * FacultyController.create()
	 *
	 * Yeni kullanıcı ekler
	 * // FIXME: email checking can be moved to client as well
	 */
	create: function (req, res) {
		var candidate = new FacultyModel({
			fullname : req.body.fullname,
			email : req.body.email,
			position : req.body.position,
			rank : req.body.rank,
			office : req.body.office,
			phone : req.body.phone,
			mobile : req.body.mobile,
			load : req.body.load,
			vacation : req.body.vacation,
			busy : req.body.busy,
			task : req.body.task
		});

		// see if email exists in db
		FacultyModel.findOne({email: candidate.email}, function (err, Faculty) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Faculty',
					error: err
				});
			}
			// did it return anyting?
			if (Faculty) {
				return res.status(404).json({
					message: Faculty.email + "@gtu.edu.tr sistemde zaten kayıtlı!"
				});
			}
			// if it does not return, create new user
			candidate.save(function (err, Faculty) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating Faculty',
						error: err
					});
				}
				return res.status(201).json(Faculty);
			});
		});
	},

	/**
	 * FacultyController.update()
	 *
	 * kullanıyı günceller.
	 */
	update: function (req, res) {
		var id = req.params.id;
		FacultyModel.findOne({_id: id}, function (err, Faculty) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting Faculty',
					error: err
				});
			}
			if (!Faculty) {
				return res.status(404).json({
					message: 'No such Faculty'
				});
			}

			// update the relevant content
			Faculty.fullname = req.body.fullname ? req.body.fullname : Faculty.fullname;
			Faculty.email = req.body.email ? req.body.email : Faculty.email;
			Faculty.position = req.body.position ? req.body.position : Faculty.position;
			Faculty.rank = req.body.rank ? req.body.rank : Faculty.rank;
			Faculty.office = req.body.office ? req.body.office : Faculty.office;
			Faculty.phone = req.body.phone ? req.body.phone : Faculty.phone;
			Faculty.mobile = req.body.mobile ? req.body.mobile : Faculty.mobile;
			Faculty.load = req.body.load ? req.body.load : Faculty.load;
			Faculty.pendingload = req.body.pendingload ? req.body.pendingload : Faculty.pendingload;
			if ( req.body.vacation !== undefined ) {
				Faculty.vacation = req.body.vacation;
			}
			Faculty.busy = req.body.busy ? req.body.busy : Faculty.busy;
			Faculty.task = req.body.task ? req.body.task : Faculty.task;

			Faculty.save(function (err, Faculty) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating Faculty.',
						error: err
					});
				}

				return res.json(Faculty);
			});
		});
	},

	/**
	 * FacultyController.remove()
	 *
	 * verilen kullanıcıyı siler
	 */
	remove: function (req, res) {
		var id = req.params.id;
		FacultyModel.findByIdAndRemove(id, function (err, Faculty) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting Faculty.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};
