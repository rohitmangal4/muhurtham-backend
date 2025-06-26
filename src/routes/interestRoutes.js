const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  sendInterest,
  respondToInterest,
  getSentInterests,
  getReceivedInterests,
  getMutualInterests,
  getRejectedInterests
} = require("../controller/interestController");

// Send Interest
router.post("/send/:receiverId", protect, sendInterest);

// Accept or Reject
router.put("/respond/:interestId", protect, respondToInterest);

// Get Interests
router.get("/sent", protect, getSentInterests);
router.get("/received", protect, getReceivedInterests);
router.get("/mutual", protect, getMutualInterests);
router.get("/rejected", protect, getRejectedInterests);

module.exports = router;
