var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZamanSchema = new Schema(
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
    owner_id: {
      type: Schema.Types.ObjectId,
      required: false
    }
  }, {collection: 'times'}
);

//Export model
module.exports = mongoose.model('Zaman', ZamanSchema);