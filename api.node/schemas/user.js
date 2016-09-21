var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/MeanApp');


var UserSchema = new Schema({
    username: String,
    password: String,
    role:String
});

module.exports = mongoose.model('User', UserSchema);

