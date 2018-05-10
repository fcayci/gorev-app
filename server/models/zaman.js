var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZamanSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    recur: {
      type: Boolean,
      required: true
    },
    tor: {
      type: Number,
      required: false,
      enum: [1, 7]  // ['Daily', 'Weekly']
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      required: false
    }
  }, {collection: 'times'}
);

//Export model
module.exports = mongoose.model('Zaman', ZamanSchema);