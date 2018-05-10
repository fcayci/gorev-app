var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GorevSchema = new Schema(
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
    customType: {
      type: String,
      required: false
    },
    startDate: {
      type: Schema.ObjectId,
      ref: 'Zaman',
      required: true
    },
    endDate: {
      type: Schema.ObjectId,
      ref: 'Zaman',
      required: true
    },
    peopleCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    choosenPeople: [{
      type: Schema.ObjectId,
      ref: 'OE',
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
GorevSchema
.virtual('url')
.get(function () {
  return '/tasks/' + this._id;
});

//Export model
module.exports = mongoose.model('Gorev', GorevSchema);