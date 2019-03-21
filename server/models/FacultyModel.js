var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var FacultySchema = new Schema({
	'fullname' : String,
	'email' : {
		type: String,
		lowercase: true,
		trim: true
	},
	'position' : String,
	'rank' : Number,
	'office' : String,
	'phone' : String,
	'mobile' : String,
	'load' : {
		type: Number,
		default: 0
	},
	'pendingload' : {
		type: Number,
		default: 0
	},
	'vacation' : {
		type: Boolean,
		default: false
	},
	'busy' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'Busy'
	}],
	'task' : [{
		type: Schema.Types.ObjectId,
		ref: 'Task'
	}]
});

module.exports = mongoose.model('Faculty', FacultySchema);
