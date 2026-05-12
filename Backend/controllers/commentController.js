const Comment = require("../models/Comment");
const { checkModeration } = require("../utils/moderationAI");

const addComment = async (req, res) => {
  try {
    // 🔥 Comment bhi check hoga
    const result = await checkModeration(req.body.text);

    if (result.isOffensive) {
      return res.status(400).json({
        message: "Comment contains inappropriate content.",
        reason: result.reason
      });
    }

const comment = await Comment.create({
  postId: req.body.postId,
  userId: req.user.id,
  text: req.body.text
});

const populatedComment = await Comment.findById(comment._id)
  .populate("userId", "name");

res.json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComments = async (req, res) => {
 const comments = await Comment.find({ postId: req.params.postId })
  .populate("userId", "name")
  .sort({ createdAt: -1 });
  res.json(comments);
};

module.exports = { addComment, getComments };