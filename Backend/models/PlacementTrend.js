const mongoose = require("mongoose");

const placementTrendSchema = new mongoose.Schema({
    year: { type: String, required: true },
    avg: { type: Number, required: true },
    companies: { type: Number, required: true }
});

module.exports = mongoose.model("PlacementTrend", placementTrendSchema);
