'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

var messageSchema = new Schema({
	_id:{type: ObjectId, required: true},
	username:{type: String,required: true},
	message:{type: String, required: true},
	timestamp:{type: Date,required: true, default:Date.now}

});

var Messages=mongoose.model('Messages',messageSchema);
module.exports = Messages