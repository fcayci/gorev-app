var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
	'name' : String,
	'type' : String,
	'peoplecount' : Number,
	'weight' : Number,
	'load' : Number,
	'chosens' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Faculty'
	},
	'startdate' : Date,
	'enddate' : Date,
	'duration' : Number,
	'status' : Number
});

module.exports = mongoose.model('Task', TaskSchema);
