const express = require("express");
const { getOrCreateChatGroup, sendMessage, getChatMessages } = require("../controllers/chatController");

const router = express.Router();

router.post("/group", getOrCreateChatGroup); // Join or create a chat group
router.post("/message", sendMessage); // Send a message
router.get("/messages/:chat_group_id", getChatMessages); // Get chat messages

module.exports = router;
