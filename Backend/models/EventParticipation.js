const mongoose = require("mongoose");

const eventParticipationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    enrollmentNo: {
        type: String,
        required: true,
    },
    year: {
        type: String,
    },
    branch: {
        type: String,
    },
    mobile: {
        type: String,
    },
    gender: {
        type: String,
    },
    eventTitle: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    reviewedAt: {
        type: Date,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    adminMessage: {
        type: String,
    },
});

module.exports = mongoose.model("EventParticipation", eventParticipationSchema);
