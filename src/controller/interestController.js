const Interest = require("../models/Interest");
const User = require("../models/User");

// ✅ Send Interest
const sendInterest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const alreadyExists = await Interest.findOne({ senderId, receiverId });
    if (alreadyExists) return res.status(400).json({ message: "Already sent" });

    const interest = new Interest({ senderId, receiverId, status: "pending" });
    await interest.save();

    res.json({ message: "Interest sent successfully" });
  } catch (err) {
    console.error("Send Interest Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Accept / Reject Interest
const respondToInterest = async (req, res) => {
  try {
    const interestId = req.params.interestId;
    const { status } = req.body;
    const receiverId = req.user.id;

    const interest = await Interest.findById(interestId);
    if (!interest) return res.status(404).json({ message: 'Interest not found' });

    if (interest.receiverId.toString() !== receiverId)
      return res.status(403).json({ message: 'Unauthorized action' });

    interest.status = status;
    await interest.save();

    // ✅ If accepted, check for reverse interest and create it
    if (status === "accepted") {
      const reverseExists = await Interest.findOne({
        senderId: receiverId,
        receiverId: interest.senderId,
      });

      if (!reverseExists) {
        const newInterest = new Interest({
          senderId: receiverId,
          receiverId: interest.senderId,
          status: "accepted",
        });
        await newInterest.save();
      }
    }

    res.json({ message: `Interest ${status}` });
  } catch (err) {
    console.error("Respond to interest error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ Sent Interests
const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ senderId: req.user.id })
      .populate("receiverId", "-password");
    res.json(interests.map(i => i.receiverId));
  } catch (err) {
    console.error("Sent Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Received Interests
const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiverId: req.user.id,
      status: "pending"
    }).populate("senderId", "-password");
    res.json(interests.map(i => ({
      _id: i._id,
      sender: i.senderId
    })));
  } catch (err) {
    console.error("Received Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Mutual Interests
const getMutualInterests = async (req, res) => {
  try {
    const myId = req.user.id;

    const accepted = await Interest.find({
      status: "accepted",
      $or: [{ senderId: myId }, { receiverId: myId }],
    });

    // Create a unique set of mutual matches
    const matchedUserIds = new Set();

    for (let i of accepted) {
      const oppositeId =
        i.senderId.toString() === myId
          ? i.receiverId.toString()
          : i.senderId.toString();

      const reverseInterest = await Interest.findOne({
        senderId: oppositeId,
        receiverId: myId,
        status: "accepted",
      });

      if (reverseInterest) {
        matchedUserIds.add(oppositeId);
      }
    }

    const users = await User.find({
      _id: { $in: Array.from(matchedUserIds) },
    }).select("-password");

    res.json(users);
  } catch (err) {
    console.error("Get mutual interests error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ Rejected Interests
const getRejectedInterests = async (req, res) => {
  try {
    const myId = req.user.id;
    const interests = await Interest.find({
      $or: [
        { senderId: myId, status: "rejected" },
        { receiverId: myId, status: "rejected" }
      ]
    });

    const ids = interests.map(i =>
      i.senderId.toString() === myId ? i.receiverId : i.senderId
    );

    const users = await User.find({ _id: { $in: ids } }).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Rejected Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  sendInterest,
  respondToInterest,
  getSentInterests,
  getReceivedInterests,
  getMutualInterests,
  getRejectedInterests
};
