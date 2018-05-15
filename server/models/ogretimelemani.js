const mongoose   = require('mongoose'),
//      timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

// TODO add ObjectID for Zaman
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
      max: 30,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      max: 30,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: false,
      max: 100
    },
    position: {
      type: String,
      required: true
    },
    office: {
      type: String,
      required: true
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
      required: true
    },
    busy: [{
      type: Schema.ObjectId,
      ref: 'Zaman'
    }],
    vacation: {
      type: Boolean,
      required: true,
      default: false
    },
  }, {collection: 'users'}
);

//OESchema.plugin(timestamps);

// Virtual for person's URL
OESchema
.virtual('url')
.get(function () {
  return '/kadro/' + this._id;
});

//Export model
module.exports = mongoose.model('OE', OESchema);