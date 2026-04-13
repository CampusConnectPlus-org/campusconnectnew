const mongoose = require("mongoose");

const placedStudentSchema = new mongoose.Schema({
    enrollmentNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branch: { type: String, required: true },
    company: { type: String, required: true },
    package: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PlacedStudent", placedStudentSchema);
