const mongoose   = require('mongoose'),
      timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const OESchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      max: 100
    },
    email: {
      type: String,
      required: true,
      max: 100
    },
    username: {
      type: String,
      required: false,
      max: 100
    },
    password: {
      type: String,
      required: false,
      max: 100
    },
    office: {
      type: String,
      required: false,
      min:3,
      max: 4
    },
    phone: {
      type: String,
      required: true,
      min: 4,
      max: 4
    },
    mobile: {
      type: String,
      required: false,
      min: 11,
      max: 11
    },
    load: {
      type: Number,
      required: false
    }
  }, { collection: 'users' }
);

OESchema.plugin(timestamps);

// Virtual for person's URL
OESchema
.virtual('url')
.get(function () {
  return '/people/' + this._id;
});

//Export model
module.exports = mongoose.model('OE', OESchema);