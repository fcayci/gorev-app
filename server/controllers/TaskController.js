var TaskModel = require('../models/TaskModel.js');

/**
 * TaskController.js
 *
 * @description :: Server-side logic for managing Tasks.
 */
module.exports = {

    /**
     * TaskController.list()
     */
    list: function (req, res) {
        TaskModel.find(function (err, Tasks) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Task.',
                    error: err
                });
            }
            return res.json(Tasks);
        });
    },

    /**
     * TaskController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        TaskModel.findOne({_id: id}, function (err, Task) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Task.',
                    error: err
                });
            }
            if (!Task) {
                return res.status(404).json({
                    message: 'No such Task'
                });
            }
            return res.json(Task);
        });
    },

    /**
     * TaskController.create()
     */
    create: function (req, res) {
        var Task = new TaskModel({
			name : req.body.name,
			type : req.body.type,
			peoplecount : req.body.peoplecount,
			weight : req.body.weight,
			load : req.body.load,
			chosens : req.body.chosens,
			startdate : req.body.startdate,
			enddate : req.body.enddate,
			duration : req.body.duration,
			status : req.body.status

        });

        Task.save(function (err, Task) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Task',
                    error: err
                });
            }
            return res.status(201).json(Task);
        });
    },

    /**
     * TaskController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        TaskModel.findOne({_id: id}, function (err, Task) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Task',
                    error: err
                });
            }
            if (!Task) {
                return res.status(404).json({
                    message: 'No such Task'
                });
            }

            Task.name = req.body.name ? req.body.name : Task.name;
			Task.type = req.body.type ? req.body.type : Task.type;
			Task.peoplecount = req.body.peoplecount ? req.body.peoplecount : Task.peoplecount;
			Task.weight = req.body.weight ? req.body.weight : Task.weight;
			Task.load = req.body.load ? req.body.load : Task.load;
			Task.chosens = req.body.chosens ? req.body.chosens : Task.chosens;
			Task.startdate = req.body.startdate ? req.body.startdate : Task.startdate;
			Task.enddate = req.body.enddate ? req.body.enddate : Task.enddate;
			Task.duration = req.body.duration ? req.body.duration : Task.duration;
			Task.status = req.body.status ? req.body.status : Task.status;
			
            Task.save(function (err, Task) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Task.',
                        error: err
                    });
                }

                return res.json(Task);
            });
        });
    },

    /**
     * TaskController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        TaskModel.findByIdAndRemove(id, function (err, Task) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Task.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};