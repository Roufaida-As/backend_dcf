const express = require("express");
const { addComment, getComments } = require("../controllers/commentController");
const router = express.Router();

router.post("/leave-a-comment", addComment);
router.get("/:post_id", getComments);

module.exports = router;
