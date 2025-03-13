const express = require("express");
const multer = require("multer");
const {
    createPost,
    updatePost,
    deletePost
} = require("../controllers/postController");
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/create-post", upload.array("images", 5), createPost); // Allows up to 5 images per post
router.put("/modify/:post_id", upload.array("images", 5), updatePost); // Modify post
router.delete("/delete/:post_id", deletePost);// Delete post

module.exports = router;
