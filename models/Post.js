var mongoose = require('mongoose');
var Schema = mongoose.Schema;

  var postSchema = new Schema({
    image: String,
    UserId: { type: Schema.Types.ObjectId, ref: "User"},
    caption: String,
    like: Number
  },{timestamps: true});


  const Post = mongoose.model('Post', postSchema)

  module.exports = Post