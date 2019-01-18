const mongoose = require('mongoose')
const Schema = mongoose.Schema

var comSchema = new Schema({
    comment: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' }
})

const Com = mongoose.model('Com', comSchema)
module.exports = Com