var mongoose= require('mongoose');

var schema = new mongoose.Schema({
    text: {type:String, required:true},
    url: {type:String},
    type: {type:String, required:true},
    name: {type:String, required:true}, 
    userid:{type:String, required:true},
    verified:{type:Boolean, default:false}
})

module.exports = mongoose.model('Post',schema)