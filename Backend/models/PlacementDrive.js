const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    branch: { type: String, required: true },
    package: { type: Number, required: true },
    openingDate: { type: Date },
    closingDate: { type: Date },
    date: { type: Date }, // Actual drive date
    venue: { type: String },
    reportingTime: { type: String },
    additionalInstructions: { type: String }, // Optional field for additional instructions
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PlacementDrive", placementDriveSchema);
