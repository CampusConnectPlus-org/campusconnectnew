const mongoose = require("mongoose");

const lostFoundItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      required: true,
      enum: ["Lost", "Found"],
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    reward: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LostFoundItem", lostFoundItemSchema);