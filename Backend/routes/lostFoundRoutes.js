const express = require("express");
const router = express.Router();
const LostFoundItem = require("../models/LostFoundItem");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/Upload");

router.get("/", async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lost and found items",
      error: error.message,
    });
  }
});

router.post("/add", upload.single("itemImage"), async (req, res) => {
  try {
    const {
      itemType,
      title,
      category,
      location,
      description,
      contactName,
      contactEmail,
      contactPhone,
      reward,
    } = req.body;

    if (!itemType || !["Lost", "Found"].includes(itemType)) {
      return res.status(400).json({ message: "Item type is required" });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Item title is required" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ message: "Category is required" });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ message: "Location is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!contactName || !contactName.trim()) {
      return res.status(400).json({ message: "Contact name is required" });
    }
    if (!contactEmail || !contactEmail.trim()) {
      return res.status(400).json({ message: "Contact email is required" });
    }
    if (!contactPhone || !contactPhone.trim()) {
      return res.status(400).json({ message: "Contact phone is required" });
    }

    const item = new LostFoundItem({
      itemType,
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      description: description.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      reward: reward ? reward.trim() : "",
      image: req.file ? `uploads/${req.file.filename}` : "",
      status: "Open",
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: "Lost and found item posted successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create lost and found item",
      error: error.message,
    });
  }
});

router.get("/admin/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lost and found items",
      error: error.message,
    });
  }
});

router.put("/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const item = await LostFoundItem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      success: true,
      message: "Item status updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update item status",
      error: error.message,
    });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const item = await LostFoundItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete item",
      error: error.message,
    });
  }
});

module.exports = router;