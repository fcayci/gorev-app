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
    load: {
      type: Number,
      required: true
    },
    choosenPeople: [{
      type: Schema.ObjectId,
      ref: 'Faculty',
      required: false
    }],
    when: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      duration: {
        type: Number,
        required: true
      }
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'closed'],
      default: 'open'
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