var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var FacultySchema = new Schema({
	'fullname' : String,
	'email' : String,
	'position' : String,
	'rank' : Number,
	'office' : String,
	'phone' : String,
	'mobile' : String,
	'load' : Number,
	'vacation' : Boolean,
	'busy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Busy'
	}
});

module.exports = mongoose.model('Faculty', FacultySchema);
