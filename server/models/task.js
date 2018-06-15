var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
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
    peopleCount: {
      type: Number,
      required: true,
      min: 1
    },
    weight: {
      type: Number,
      required: true,
      min: 1
    },
    choosenPeople: [{
      type: Schema.ObjectId,
      ref: 'Faculty',
      required: false
    }],
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Completed', 'Closed'],
      default: 'Open'
    }
  }, {collection: 'tasks'}
);

// Virtual for gorev's URL
TaskSchema
.virtual('url')
.get(function () {
  return '/tasks/' + this._id;
});

//Export model
module.exports = mongoose.model('Task', TaskSchema);