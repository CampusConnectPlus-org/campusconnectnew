const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    branch: { type: String, required: true },
    package: { type: String, required: true },
    date: { type: String, required: true },
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PlacementDrive", placementDriveSchema);
