var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    title: String,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    rating: {type: Number, default: 0},
    author : [{type: Schema.Types.ObjectId, ref: 'User'}],
    content: String
});

module.exports = mongoose.model('Comments', CommentsSchema);

