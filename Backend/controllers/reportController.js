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

// ➤ Delete a report (Admin)
const deleteReport = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const deleted = await Report.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Export
module.exports = {
  reportPost,
  getReports,
  deleteReport
};