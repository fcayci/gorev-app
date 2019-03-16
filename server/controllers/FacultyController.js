var FacultyModel = require('../models/FacultyModel.js');

/**
 * FacultyController.js
 *
 * @description :: Server-side logic for managing Facultys.
 */
module.exports = {

    /**
     * FacultyController.list()
     * FIXME: should we return everyting to everybody?
     */
    list: function (req, res) {
        FacultyModel.find(function (err, Facultys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Faculty.',
                    error: err
                });
            }
            return res.json(Facultys);
        });
    },

    /**
     * FacultyController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        FacultyModel.findOne({_id: id}, function (err, Faculty) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Faculty.',
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
     */
    create: function (req, res) {
        var Faculty = new FacultyModel({
			fullname : req.body.fullname,
			email : req.body.email,
			position : req.body.position,
			rank : req.body.rank,
			office : req.body.office,
			phone : req.body.phone,
			mobile : req.body.mobile,
			load : req.body.load,
			vacation : req.body.vacation,
			busy : req.body.busy

        });

        Faculty.save(function (err, Faculty) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Faculty',
                    error: err
                });
            }
            return res.status(201).json(Faculty);
        });
    },

    /**
     * FacultyController.update()
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

            Faculty.fullname = req.body.fullname ? req.body.fullname : Faculty.fullname;
			Faculty.email = req.body.email ? req.body.email : Faculty.email;
			Faculty.position = req.body.position ? req.body.position : Faculty.position;
			Faculty.rank = req.body.rank ? req.body.rank : Faculty.rank;
			Faculty.office = req.body.office ? req.body.office : Faculty.office;
			Faculty.phone = req.body.phone ? req.body.phone : Faculty.phone;
			Faculty.mobile = req.body.mobile ? req.body.mobile : Faculty.mobile;
			Faculty.load = req.body.load ? req.body.load : Faculty.load;
			Faculty.vacation = req.body.vacation ? req.body.vacation : Faculty.vacation;
			Faculty.busy = req.body.busy ? req.body.busy : Faculty.busy;
			
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
     */
    remove: function (req, res) {
        var id = req.params.id;
        FacultyModel.findByIdAndRemove(id, function (err, Faculty) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Faculty.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
