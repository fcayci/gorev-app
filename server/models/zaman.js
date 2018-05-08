var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ZamanSchema = new Schema(
  {
    dateStart: {
      type: Date,
      required: true
    },
    dateEnd: {
      type: Date,
      required: true
    },
    timeStart: {
      type: String,
      required: true
    },
    timeEnd: {
      type: String,
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