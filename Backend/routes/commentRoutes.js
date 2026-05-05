const express = require("express");
const { addComment, getComments } = require("../controllers/commentController");
const auth = require("../middleware/verifyToken");

const router = express.Router();

// add comment
router.post("/add", auth, addComment);

// get comments by post
router.get("/:postId", getComments);

module.exports = router;