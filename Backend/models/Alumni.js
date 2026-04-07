const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  batch: String,
  desc: String,
  email: String,
  linkedin: String,
  image: String // store filename
}, { timestamps: true });

module.exports = mongoose.model("Alumni", alumniSchema);