var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
	'name' : String,
	'group' : String,
	'peoplecount' : Number,
	'weight' : Number,
	'load' : Number,
	'owners' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'Faculty'
	}],
	'startdate' : Date,
	'enddate' : Date,
	'duration' : Number,
	'state' : Number
});

module.exports = mongoose.model('Task', TaskSchema);
