const mongoose = require("mongoose");

const placementStatSchema = new mongoose.Schema({
    highestPackage: { type: String, required: true },
    averagePackage: { type: String, required: true },
    totalCompanies: { type: String, required: true },
    placementRate: { type: String, required: true }
});

module.exports = mongoose.model("PlacementStat", placementStatSchema);
