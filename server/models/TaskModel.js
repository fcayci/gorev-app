var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
	'description' : {
		type: String,
		trim: true
	},
	'taskgroup' : String,
	'peoplecount' : Number,
	'load' : Number,
	'owners' : [{
		'id' : String,
		'state' : Number,
		'newload' : Number
	}],
	'startdate' : Date,
	'enddate' : Date,
	'duration' : Number,
	'recur' : Number,
	'state' : Number
});

module.exports = mongoose.model('Task', TaskSchema);
