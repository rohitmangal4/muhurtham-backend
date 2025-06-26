const mongoose = require("mongoose");
const { v4 } = require("uuid");

const messageSchema = new mongoose.Schema(
  {
    _id:{
      type: String,
      default: v4

    },
    senderId: {
      type: String,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: String,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
