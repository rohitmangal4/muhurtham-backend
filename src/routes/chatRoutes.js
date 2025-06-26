const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  sendMessage,
  getMessagesBetweenUsers,
  getMutualChatUsers,
} = require("../controller/chatController");

router.post("/send", protect, sendMessage);
router.get("/:userId", protect, getMessagesBetweenUsers);
router.get("/mutual/list", protect, getMutualChatUsers);

module.exports = router;
