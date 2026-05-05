const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  isAutoFlagged: { type: Boolean, default: false },
  originalContent: String
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);