const Post = require("../models/Post");
const Report = require("../models/Report");
const { checkModeration } = require("../utils/moderationAI");

// ➤ Create Post — AI moderation added
const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;

    // 🔥 AI moderation check
    if (content && content.trim()) {
      const result = await checkModeration(content);
        console.log("🔍 Moderation result:", result);
      if (result.isOffensive) {
        // Admin ko auto-report bhejo
        await Report.create({
          postId: null,           // post bani nahi abhi
          reportedBy: req.user.id,
          reason: `[AI AUTO-FLAG] ${result.reason} | Severity: ${result.severity}`,
          isAutoFlagged: true,
          originalContent: content
        });

        return res.status(400).json({
          message: "Your post contains inappropriate content and was not published.",
          reason: result.reason
        });
      }
    }

    const post = await Post.create({
      userId: req.user.id,
      content,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      image: req.file ? req.file.filename : null
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ➤ Get Posts (with search support)
const getPosts = async (req, res) => {
  try {
    const { sort, search, tag } = req.query;
    let filter = {};

    // 🔥 Tag search
    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }

    // 🔥 Text search (content mein)
    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    let posts = await Post.find(filter).populate("userId", "name");

    if (sort === "likes") {
      posts.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ 🔥 Get Related/Recommended Posts
const getRelatedPosts = async (req, res) => {
  try {
    const { tags, excludeId } = req.query;
    
    if (!tags) return res.json([]);

    const tagArray = tags.split(",").map(t => t.trim());

    const related = await Post.find({
      tags: { $in: tagArray },
      _id: { $ne: excludeId }
    })
      .populate("userId", "name")
      .limit(4)
      .sort({ createdAt: -1 });

    res.json(related);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Like / Unlike
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Delete (Admin only)
const deletePost = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPost, getPosts, likePost, deletePost, getRelatedPosts };