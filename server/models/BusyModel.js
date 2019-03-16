var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var BusySchema = new Schema({
	'name' : String,
	'startdate' : Date,
	'enddate' : Date,
	'recur' : Number,
	'owner' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Faculty'
	}
});

module.exports = mongoose.model('Busy', BusySchema);
