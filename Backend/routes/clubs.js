const express = require("express");
const router = express.Router();
const Club = require("../models/clubs");
const Admin = require("../models/Admin");
const {
  sendClubMembershipApprovalEmail,
  sendClubMembershipRejectionEmail,
  sendAdminClubMembershipNotification,
  sendEventParticipationApprovalEmail,
  sendEventParticipationRejectionEmail,
  sendAdminEventParticipationNotification,
} = require("../utils/emailService");

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

    // Check if user already applied or is already a member
    const alreadyApplied = club.registrations.some(r => r.email === req.body.email);
    const alreadyMember = club.members.some(m => m.email === req.body.email);

    if (alreadyApplied || alreadyMember) {
      return res.status(400).json({ error: "You have already applied or are already a member of this club" });
    }

    club.registrations.push(req.body);
    await club.save();

    // Send notification to admin (get admin email from env or use a default)
    const admins = await Admin.find();
    for (const admin of admins) {
      await sendAdminClubMembershipNotification(admin.email, req.body, club.name);
    }

    res.json({ message: "Registration saved. Awaiting admin approval." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:id/participate", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    // Only approved members (club.members) can participate in club events.
    const isMember = club.members.some(
      m => m.email === req.body.email
    );
    if (!isMember) {
      return res.status(403).json({
        error: "NOT_A_MEMBER",
        message: `You must be an approved member of ${club.name} to participate in its events. Please join the club first and wait for admin approval.`
      });
    }
    // Check if user already applied or already approved for this event
    const alreadyApplied = club.eventParticipationRequests.some(
      r => r.email === req.body.email && r.eventTitle === req.body.eventTitle
    );
    const alreadyApproved = club.eventParticipants.some(
      p => p.email === req.body.email && p.eventTitle === req.body.eventTitle
    );

    if (alreadyApplied || alreadyApproved) {
      return res.status(400).json({ error: "You have already applied or been approved for this event" });
    }

    club.eventParticipationRequests.push(req.body);
    await club.save();

    // Send notification to admin
    const admins = await Admin.find();
    for (const admin of admins) {
      await sendAdminEventParticipationNotification(admin.email, req.body, req.body.eventTitle);
    }

    res.json({ message: "Participation request received, awaiting approval" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a registration request
router.post("/:id/registrations/:index/approve", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const index = parseInt(req.params.index);

    if (index < 0 || index >= club.registrations.length) {
      return res.status(400).json({ error: "Invalid registration index" });
    }

    // Move registration to members
    const registration = club.registrations[index];
    club.members.push(registration);

    // Remove from registrations
    club.registrations.splice(index, 1);

    await club.save();

    // Send approval email to participant
    await sendClubMembershipApprovalEmail(registration.email, `${registration.firstName} ${registration.lastName}`, club.name);

    res.json({ message: "Registration approved", club });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject a registration request
router.post("/:id/registrations/:index/reject", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const index = parseInt(req.params.index);

    if (index < 0 || index >= club.registrations.length) {
      return res.status(400).json({ error: "Invalid registration index" });
    }

    const registration = club.registrations[index];
    const rejectionMessage = req.body.rejectionMessage || null;

    // Remove from registrations
    club.registrations.splice(index, 1);

    await club.save();

    // Send rejection email to participant
    await sendClubMembershipRejectionEmail(
      registration.email,
      `${registration.firstName} ${registration.lastName}`,
      club.name,
      rejectionMessage
    );

    res.json({ message: "Registration rejected", club });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve an event participation request
router.post("/:id/eventParticipation/:index/approve", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const index = parseInt(req.params.index);

    if (index < 0 || index >= club.eventParticipationRequests.length) {
      return res.status(400).json({ error: "Invalid participation request index" });
    }

    // Move participation request to approved participants
    const participationRequest = club.eventParticipationRequests[index];
    club.eventParticipants.push(participationRequest);

    // Remove from requests
    club.eventParticipationRequests.splice(index, 1);

    await club.save();

    // Send approval email to participant
    await sendEventParticipationApprovalEmail(
      participationRequest.email,
      `${participationRequest.firstName} ${participationRequest.lastName}`,
      participationRequest.eventTitle,
      new Date() // Using current date as placeholder - update with actual event date if available
    );

    res.json({ message: "Participation request approved", club });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject an event participation request
router.post("/:id/eventParticipation/:index/reject", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const index = parseInt(req.params.index);

    if (index < 0 || index >= club.eventParticipationRequests.length) {
      return res.status(400).json({ error: "Invalid participation request index" });
    }

    const participationRequest = club.eventParticipationRequests[index];
    const rejectionMessage = req.body.rejectionMessage || null;

    // Remove from requests
    club.eventParticipationRequests.splice(index, 1);

    await club.save();

    // Send rejection email to participant
    await sendEventParticipationRejectionEmail(
      participationRequest.email,
      `${participationRequest.firstName} ${participationRequest.lastName}`,
      participationRequest.eventTitle,
      rejectionMessage
    );

    res.json({ message: "Participation request rejected", club });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove an approved event participant
router.post("/:id/eventParticipants/:participantId/remove", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const participantId = req.params.participantId;

    // Find and remove the participant
    club.eventParticipants = club.eventParticipants.filter(
      (p) => p._id.toString() !== participantId
    );

    await club.save();

    res.json({ message: "Participant removed", club });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);

    res.json({ message: "Club deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
