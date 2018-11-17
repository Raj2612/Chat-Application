'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;
const md5=require('md5');


var userSchema = new Schema({
	_id:{type: ObjectId, required: true},
	username:{type: String,required: true},
	password:{type: String, required: true},
	role:{type: String, required: true},
	postStatus:{type: Boolean, required: true},

});
userSchema.methods.checkPassword = function(upass){
	return  this.password == md5(upass);
};
var Users=mongoose.model('Users',userSchema);
module.exports = Users