const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  title: String,
  provider: String,
  category: String, // "state" | "central" | "private"
  amount: String,
  deadline: Date,
  eligibility: {
    casteCategory: [String], // ["SC", "ST", "OBC", "General", "EBC"]
    maxIncome: Number,       // e.g. 250000
    minPercentage: Number,   // e.g. 60
    genderRequired: String   // "female" | "any"
  },
  documents: [String],
  officialLink: String,
  status: { type: String, default: "open" } // "open" | "closed"
}, { timestamps: true });

module.exports = mongoose.model("Scholarship", scholarshipSchema);