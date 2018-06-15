var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BusySchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    recur: {
      type: Number,
      required: true,
      enum: [0, 1, 7]
    },
    task_id: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Task'
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Faculty'
    }
  }, {collection: 'times'}
);

//Export model
module.exports = mongoose.model('Busy', BusySchema);