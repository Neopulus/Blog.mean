var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    content:  String,
    author: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
    create_at: { type: Date, default: Date.now },
    update_at :{type: Date, default: Date.now}
});

module.exports = mongoose.model('Article', ArticleSchema);
