var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
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
		'owner' : String,
		'description' : String,
		'startdate' : Date,
		'enddate' : Date,
		'recur' : Number
	}],
	'task' : [{
		type: Schema.Types.ObjectId,
		ref: 'Task'
	}]
});




module.exports = mongoose.model('User', UserSchema);
