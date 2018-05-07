var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GorevSchema = new Schema(
  {
    title: {type: String, required: true},
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