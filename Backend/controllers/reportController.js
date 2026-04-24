const Report = require("../models/Report");

// ➤ Report a post
const reportPost = async (req, res) => {
  try {
    const { postId, reason } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({ message: "PostId and reason required" });
    }

    const report = await Report.create({
      postId,
      reportedBy: req.user.id,
      reason
    });

    res.json(report);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Get all reports (Admin)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("postId")
      .populate("reportedBy", "name");

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Export
module.exports = {
  reportPost,
  getReports
};