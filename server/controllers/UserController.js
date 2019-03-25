var UserModel = require('../models/UserModel.js');

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {

	/**
	 * UserController.list()
	 *
	 * Sistemde kayıtlı bütün kullanıcıların listesini çekerç
	 * rank'a göre sıralar
	 *
	 */
	list: function (req, res) {
		UserModel.find(function (err, Users) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting User',
					error: err
				});
			}
			return res.json(Users)
		})
		.sort({rank: 1});
	},

	/**
	 * UserController.show()
	 *
	 * Kullanıcı IDsi verilen kişiyi çeker.
	 */
	show: function (req, res) {
		var id = req.params.id;
		UserModel.findOne({_id: id}, function (err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting User',
					error: err
				});
			}
			if (!User) {
				return res.status(404).json({
					message: 'No such User'
				});
			}
			return res.json(User);
		});
	},

	/**
	 * UserController.create()
	 *
	 * Yeni kullanıcı ekler
	 * // FIXME: email checking can be moved to client as well
	 */
	create: function (req, res) {
		var candidate = new UserModel({
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
		UserModel.findOne({email: candidate.email}, function (err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting User',
					error: err
				});
			}
			// did it return anyting?
			if (User) {
				return res.status(404).json({
					message: User.email + "@gtu.edu.tr sistemde zaten kayıtlı!"
				});
			}
			// if it does not return, create new user
			candidate.save(function (err, User) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating User',
						error: err
					});
				}
				return res.status(201).json(User);
			});
		});
	},

	/**
	 * UserController.update()
	 *
	 * kullanıyı günceller.
	 */
	update: function (req, res) {
		var id = req.params.id;
		UserModel.findOne({_id: id}, function (err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting User',
					error: err
				});
			}
			if (!User) {
				return res.status(404).json({
					message: 'No such User'
				});
			}

			// update the relevant content
			User.fullname = req.body.fullname ? req.body.fullname : User.fullname;
			User.email = req.body.email ? req.body.email : User.email;
			User.position = req.body.position ? req.body.position : User.position;
			User.rank = req.body.rank ? req.body.rank : User.rank;
			User.office = req.body.office ? req.body.office : User.office;
			User.phone = req.body.phone ? req.body.phone : User.phone;
			User.mobile = req.body.mobile ? req.body.mobile : User.mobile;
			User.load = req.body.load ? req.body.load : User.load;
			User.pendingload = req.body.pendingload ? req.body.pendingload : User.pendingload;
			if ( req.body.vacation !== undefined ) {
				User.vacation = req.body.vacation;
			}
			User.busy = req.body.busy ? req.body.busy : User.busy;
			User.task = req.body.task ? req.body.task : User.task;

			User.save(function (err, User) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating User.',
						error: err
					});
				}

				return res.json(User);
			});
		});
	},

	/**
	 * UserController.remove()
	 *
	 * verilen kullanıcıyı siler
	 */
	remove: function (req, res) {
		var id = req.params.id;
		UserModel.findByIdAndRemove(id, function (err, User) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting User.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};


// var BusyModel = require('../models/BusyModel.js');

// /**
//  * BusyController.js
//  *
//  * @description :: Server-side logic for managing Busys.
//  */
// module.exports = {

//     /**
//      * BusyController.list()
//      */
//     list: function (req, res) {
//         BusyModel.find(function (err, Busys) {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when getting Busy.',
//                     error: err
//                 });
//             }
//             return res.json(Busys);
//         });
//     },

//     /**
//      * BusyController.show()
//      */
//     showUser: function (req, res) {
//         var id = req.params.id;
//         BusyModel.find({owner: id}, function (err, Busy) {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when getting Busy.',
//                     error: err
//                 });
//             }
//             // if (!Busy) {
//             //     return res.status(404).json({
//             //         message: 'No such Busy'
//             //     });
//             // }
//             return res.json(Busy);
//         });
//     },


//     /**
//      * BusyController.show()
//      */
//     show: function (req, res) {
//         var id = req.params.id;
//         BusyModel.findOne({_id: id}, function (err, Busy) {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when getting Busy.',
//                     error: err
//                 });
//             }
//             if (!Busy) {
//                 return res.status(404).json({
//                     message: 'No such Busy'
//                 });
//             }
//             return res.json(Busy);
//         });
//     },

//     /**
//      * BusyController.create()
//      */
//     create: function (req, res) {
//         var Busy = new BusyModel({
// 			name : req.body.name,
// 			startdate : req.body.startdate,
// 			enddate : req.body.enddate,
// 			recur : req.body.recur,
// 			owner : req.body.owner

//         });

//         Busy.save(function (err, Busy) {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when creating Busy',
//                     error: err
//                 });
//             }
//             return res.status(201).json(Busy);
//         });
//     },

//     /**
//      * BusyController.update()
//      */
//     update: function (req, res) {
//         var id = req.params.id;
//         BusyModel.findOne({_id: id}, function (err, Busy) {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when getting Busy',
//                     error: err
//                 });
//             }
//             if (!Busy) {
//                 return res.status(404).json({
//                     message: 'No such Busy'
//                 });
//             }

//             Busy.name = req.body.name ? req.body.name : Busy.name;
// 			Busy.startdate = req.body.startdate ? req.body.startdate : Busy.startdate;
// 			Busy.enddate = req.body.enddate ? req.body.enddate : Busy.enddate;
// 			Busy.recur = req.body.recur ? req.body.recur : Busy.recur;
// 			Busy.owner = req.body.owner ? req.body.owner : Busy.owner;

//             Busy.save(function (err, Busy) {
//                 if (err) {
//                     return res.status(500).json({
//                         message: 'Error when updating Busy.',
//                         error: err
//                     });
//                 }

//                 return res.json(Busy);
//             });
//         });
//     },

//     /**
//      * BusyController.remove()
//      */
//     remove: function (req, res) {
//         var id = req.params.id;
//         BusyModel.findByIdAndRemove(id, function (err, Busy) {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when deleting the Busy.',
//                     error: err
//                 });
//             }
//             return res.status(204).json();
//         });
//     }
// };
