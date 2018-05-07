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
    dateStart: {
      type: Date,
      required: true
    },
    dateEnd: {
      type: Date,
      required: false
    },
    timeStart: {
      type: String,
      required: false
    },
    timeEnd: {
      type: String,
      required: false
    },
    peopleCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    choosenPeople: {
      type: Schema.ObjectId,
      ref: 'OE',
      required: false
    },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Completed', 'Closed'],
      default: 'Open'
    }
  }
);

// Virtual for gorev's URL
GorevSchema
.virtual('url')
.get(function () {
  return '/tasks/' + this._id;
});

//Export model
module.exports = mongoose.model('Gorev', GorevSchema);