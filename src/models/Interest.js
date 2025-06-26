// models/Interest.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const interestSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interest', interestSchema);
