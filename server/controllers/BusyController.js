var BusyModel = require('../models/BusyModel.js');

/**
 * BusyController.js
 *
 * @description :: Server-side logic for managing Busys.
 */
module.exports = {

    /**
     * BusyController.list()
     */
    list: function (req, res) {
        BusyModel.find(function (err, Busys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Busy.',
                    error: err
                });
            }
            return res.json(Busys);
        });
    },

    /**
     * BusyController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        BusyModel.findOne({_id: id}, function (err, Busy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Busy.',
                    error: err
                });
            }
            if (!Busy) {
                return res.status(404).json({
                    message: 'No such Busy'
                });
            }
            return res.json(Busy);
        });
    },

    /**
     * BusyController.create()
     */
    create: function (req, res) {
        var Busy = new BusyModel({
			name : req.body.name,
			startdate : req.body.startdate,
			enddate : req.body.enddate,
			recur : req.body.recur,
			owner : req.body.owner

        });

        Busy.save(function (err, Busy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Busy',
                    error: err
                });
            }
            return res.status(201).json(Busy);
        });
    },

    /**
     * BusyController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        BusyModel.findOne({_id: id}, function (err, Busy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Busy',
                    error: err
                });
            }
            if (!Busy) {
                return res.status(404).json({
                    message: 'No such Busy'
                });
            }

            Busy.name = req.body.name ? req.body.name : Busy.name;
			Busy.startdate = req.body.startdate ? req.body.startdate : Busy.startdate;
			Busy.enddate = req.body.enddate ? req.body.enddate : Busy.enddate;
			Busy.recur = req.body.recur ? req.body.recur : Busy.recur;
			Busy.owner = req.body.owner ? req.body.owner : Busy.owner;
			
            Busy.save(function (err, Busy) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Busy.',
                        error: err
                    });
                }

                return res.json(Busy);
            });
        });
    },

    /**
     * BusyController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        BusyModel.findByIdAndRemove(id, function (err, Busy) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Busy.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
