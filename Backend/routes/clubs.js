const express = require("express");
const router = express.Router();
const Club = require("../models/clubs");

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single club
router.get("/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new club
router.post("/", async (req, res) => {
  try {
    const newClub = new Club(req.body);
    const saved = await newClub.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update club
router.put("/:id", async (req, res) => {
  try {
    const updated = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:id/register", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    club.registrations.push(req.body);

    await club.save();

    res.json({ message: "Registration saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:id/participate", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    club.eventParticipants.push(req.body);

    await club.save();

    res.json({ message: "Participation saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
