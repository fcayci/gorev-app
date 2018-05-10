var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: add repeat and units
// TODO: add ObjectId for OE
var ZamanSchema = new Schema(
  {
    startData: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    duration: {
      type: String,
      required: false
    }
  }, {collection: 'times'}
);

//Export model
module.exports = mongoose.model('Zaman', ZamanSchema);