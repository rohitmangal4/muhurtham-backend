const Message = require("../models/Message");
const User = require("../models/User");
const Interest = require("../models/Interest");

// Send message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get messages between two users
const getMessagesBetweenUsers = async (req, res) => {
  const myId = req.user.id;
  const otherId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName _id");

    messages.forEach((msg) => {
      msg.senderId = msg.senderId.toString();
      msg.receiverId = msg.receiverId.toString();
    });

    res.json(messages);
  } catch (err) {
    console.error("Chat fetch error:", err.message);
    res.status(500).json({ message: "Chat fetch failed" });
  }
};

// Get mutual chat users
const getMutualChatUsers = async (req, res) => {
  const myId = req.user.id;

  try {
    const interests = await Interest.find({
      status: "accepted",
      $or: [{ senderId: myId }, { receiverId: myId }],
    });

    const ids = new Set();

    interests.forEach((i) => {
      const otherUserId =
        i.senderId.toString() === myId ? i.receiverId : i.senderId;
      ids.add(otherUserId.toString());
    });

    const users = await User.find({ _id: { $in: [...ids] } }).select(
      "_id fullName"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mutual chat users" });
  }
};

module.exports = {
  sendMessage,
  getMessagesBetweenUsers,
  getMutualChatUsers,
};
