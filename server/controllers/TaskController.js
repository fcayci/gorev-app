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
		console.log('list');
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
	 * TaskController.listopen()
	 */
	listopen: function (req, res) {
		console.log('listopen');
		TaskModel.find({ 'state': 0 }, function (err, Tasks) {
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
		console.log('show', id);
		const ids = req.params.id.split(',');
		TaskModel.find({ '_id': {$in: ids} }, function (err, Task) {
		//TaskModel.find({_id: id}, function (err, Task) {
			if (err) {
				console.log(err);
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
			description : req.body.description,
			taskgroup : req.body.taskgroup,
			peoplecount : req.body.peoplecount,
			load : req.body.load,
			owners : req.body.owners,
			startdate : req.body.startdate,
			enddate : req.body.enddate,
			duration : req.body.duration,
			recur : req.body.recur,
			state : req.body.state

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
			Task.group = req.body.group ? req.body.group : Task.group;
			Task.peoplecount = req.body.peoplecount ? req.body.peoplecount : Task.peoplecount;
			Task.weight = req.body.weight ? req.body.weight : Task.weight;
			Task.load = req.body.load ? req.body.load : Task.load;
			Task.owners = req.body.owners ? req.body.owners : Task.owners;
			Task.startdate = req.body.startdate ? req.body.startdate : Task.startdate;
			Task.enddate = req.body.enddate ? req.body.enddate : Task.enddate;
			Task.duration = req.body.duration ? req.body.duration : Task.duration;
			Task.state = req.body.state ? req.body.state : Task.state;

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
		console.log('remove', id);
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
