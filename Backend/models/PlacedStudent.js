const mongoose = require("mongoose");

const placedStudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    branch: { type: String, required: true },
    company: { type: String, required: true },
    package: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PlacedStudent", placedStudentSchema);
