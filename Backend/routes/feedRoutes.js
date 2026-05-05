const express = require("express");
const {
  createPost, getPosts, likePost, deletePost, getRelatedPosts
} = require("../controllers/postController");
const upload = require("../middleware/upload");
const auth = require("../middleware/verifyToken");

const router = express.Router();

router.post("/create", auth, upload.single("image"), createPost);
router.get("/all", getPosts);                    // ?search=xyz&tag=abc&sort=likes
router.get("/related", getRelatedPosts);         // 🔥 naya
router.put("/like/:id", auth, likePost);
router.delete("/delete/:id", auth, deletePost);

module.exports = router;