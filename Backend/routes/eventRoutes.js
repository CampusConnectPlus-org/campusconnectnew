const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");
const Event = require("../models/Event");


// CREATE EVENT
// router.post(
// "/create",
// upload.single("bannerImage"),
// async (req,res)=>{

// try{

// console.log("BODY:",req.body);
// console.log("FILE:",req.file);

// const newEvent = new Event({

// title:req.body.title,

// date:req.body.date,

// location:req.body.location,

// category:req.body.category,

// bannerImage:req.file?.filename

// });

// await newEvent.save();

// res.status(201).json({
// success:true,
// message:"event created",
// data:newEvent
// });

// }

// catch(error){

// console.log("ERROR:",error);

// res.status(500).json({
// success:false,
// message:error.message
// });

// }

// });
router.post(
  "/create",
  upload.single("bannerImage"),
  async (req, res) => {

    try {

      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        location: req.body.location,
        category: req.body.category,

        bannerImage: req.file ? req.file.path : "",

        details: {
          overview: req.body.overview || "",

          highlights: req.body.highlights
            ? JSON.parse(req.body.highlights)
            : [],

          // ✅ ADD THIS
          schedule: req.body.schedule
            ? JSON.parse(req.body.schedule)
            : [],

          galleryImages: []
        }
      });

      await newEvent.save();

      res.status(201).json({
        success: true,
        data: newEvent
      });

    }

    catch (error) {

      console.log("FULL ERROR ↓");

      console.log(error);

      console.log("ERROR MESSAGE ↓");

      console.log(error.message);

      console.log("ERROR STACK ↓");

      console.log(error.stack);

      res.status(500).json({
        message: error.message
      });

    }

  });




// ADD MULTIPLE GALLERY IMAGES
router.post(
  "/gallery/:id",

  upload.array("images", 10),

  async (req, res) => {

    try {

      const images = req.files.map(

        file => ({

          url: file.path,

          caption: ""

        })

      );


      const event = await Event.findByIdAndUpdate(

        req.params.id,

        {

          $push: {

            "details.galleryImages": {

              $each: images

            }

          }

        },

        { new: true }

      );


      res.json(event);

    }

    catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  }

);




// GET ALL EVENTS
router.get(
  "/",

  async (req, res) => {

    try {

      const events = await Event.find()
        .sort({ date: 1 });

      res.json(events);

    }

    catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  }

);




// DELETE EVENT
router.delete(
  "/:id",

  async (req, res) => {

    try {

      await Event.findByIdAndDelete(

        req.params.id

      );

      res.json({

        message: "deleted"

      });

    }

    catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  }

);




// EDIT EVENT (with optional new banner)
router.put(
  "/:id",

  upload.single("bannerImage"),

  async (req, res) => {

    try {

      const updateData = {

        title: req.body.title,

        description: req.body.description,

        date: new Date(req.body.date),

        location: req.body.location,

        category: req.body.category,
        "details.overview": req.body.overview || "",
        "details.highlights": req.body.highlights
          ? JSON.parse(req.body.highlights)
          : [],
        "details.schedule": req.body.schedule
          ? JSON.parse(req.body.schedule)
          : []

      };


      if (req.file) {

        updateData.bannerImage = req.file.path;

      }


      const updated = await Event.findByIdAndUpdate(

        req.params.id,

        updateData,

        { new: true }

      );


      res.json(updated);

    }

    catch (err) {

      res.status(500).json({

        error: err.message

      });

    }

  }

);

//participant registration
router.post("/register/:id", async (req, res) => {
  try {
    const { name, year, branch, email, mobile, gender } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          participants: {
            name,
            year,
            branch,
            email,
            mobile,
            gender,
          },
        },
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      success: true,
      message: "Registered successfully",
      data: event,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// User participates in an event (creates a participation request)
router.post("/participate/:eventId", async (req, res) => {
  try {
    const EventParticipation = require("../models/EventParticipation");
    const Admin = require("../models/Admin");
    const { sendAdminNotification } = require("../utils/emailService");

    const { userId, name, email, enrollmentNo, year, branch, mobile, gender } = req.body;
    const eventId = req.params.eventId;

    // Validate required fields
    if (!name || !email || !enrollmentNo) {
      return res.status(400).json({ message: "Missing required fields: name, email, enrollmentNo" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already participated
    const existingRequest = await EventParticipation.findOne({
      event: eventId,
      email: email,
      status: { $in: ["pending", "approved"] }
    });

    if (existingRequest) {
      return res.status(409).json({ message: "You have already requested to participate in this event" });
    }

    // Create participation request
    const participation = new EventParticipation({
      event: eventId,
      user: userId,
      name,
      email,
      enrollmentNo,
      year,
      branch,
      mobile,
      gender,
      eventTitle: event.title,
      status: "pending"
    });

    await participation.save();

    // Send email notification to all admins
    const admins = await Admin.find();
    for (const admin of admins) {
      await sendAdminNotification(admin.email, participation, event);
    }

    res.status(201).json({
      success: true,
      message: "Participation request submitted. Admins will review your request shortly.",
      data: participation
    });

  } catch (error) {
    console.error("Error creating participation request:", error);
    res.status(500).json({ message: "Failed to create participation request", error: error.message });
  }
});

// Get all participation requests (for admin)
router.get("/participation-requests", async (req, res) => {
  try {
    const EventParticipation = require("../models/EventParticipation");

    // Get filter from query (pending, approved, rejected, all)
    const filter = req.query.status;

    let query = {};
    if (filter && filter !== "all") {
      query.status = filter;
    }

    const requests = await EventParticipation.find(query)
      .populate("event", "title date location")
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error("Error fetching participation requests:", error);
    res.status(500).json({ message: "Failed to fetch participation requests", error: error.message });
  }
});

// Get participation requests for a specific event (for admin)
router.get("/participation-requests/event/:eventId", async (req, res) => {
  try {
    const EventParticipation = require("../models/EventParticipation");

    const requests = await EventParticipation.find({ event: req.params.eventId })
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error("Error fetching participation requests:", error);
    res.status(500).json({ message: "Failed to fetch participation requests", error: error.message });
  }
});

// Admin approves participation request
router.put("/participation-requests/:id/approve", async (req, res) => {
  try {
    const EventParticipation = require("../models/EventParticipation");
    const { sendApprovalEmail } = require("../utils/emailService");

    const participation = await EventParticipation.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: req.body.adminId
      },
      { new: true }
    );

    if (!participation) {
      return res.status(404).json({ message: "Participation request not found" });
    }

    // Fetch event details
    const event = await Event.findById(participation.event);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Add participant to event's participants list
    const participantData = {
      name: participation.name,
      year: participation.year || "N/A",
      branch: participation.branch || "N/A",
      email: participation.email,
      mobile: participation.mobile || "N/A",
      gender: participation.gender || "N/A",
      registeredAt: new Date()
    };

    // Ensure participants array exists
    if (!event.participants) {
      event.participants = [];
    }

    // Check if participant already exists in event
    const participantExists = event.participants.some(p => p.email === participation.email);
    if (!participantExists) {
      event.participants.push(participantData);
      await event.save();
    }

    // Send approval email to user with event object
    try {
      await sendApprovalEmail(participation.email, participation.name, event);
    } catch (emailError) {
      console.error("Email sending error (non-blocking):", emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: "Participation approved and user notified",
      data: participation
    });

  } catch (error) {
    console.error("Error approving participation:", error);
    res.status(500).json({ message: "Failed to approve participation", error: error.message });
  }
});

// Admin rejects participation request
router.put("/participation-requests/:id/reject", async (req, res) => {
  try {
    const EventParticipation = require("../models/EventParticipation");
    const { sendRejectionEmail } = require("../utils/emailService");

    const { adminMessage } = req.body;

    const participation = await EventParticipation.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedBy: req.body.adminId,
        adminMessage: adminMessage || ""
      },
      { new: true }
    );

    if (!participation) {
      return res.status(404).json({ message: "Participation request not found" });
    }

    // Fetch event details
    const event = await Event.findById(participation.event);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Send rejection email to user with event object
    try {
      await sendRejectionEmail(participation.email, participation.name, event, adminMessage);
    } catch (emailError) {
      console.error("Email sending error (non-blocking):", emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: "Participation rejected and user notified",
      data: participation
    });

  } catch (error) {
    console.error("Error rejecting participation:", error);
    res.status(500).json({ message: "Failed to reject participation", error: error.message });
  }
});
// Admin deletes a participant from an event
router.delete("/events/:eventId/participants/:participantEmail", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Remove participant by email
    event.participants = event.participants.filter(
      (p) => p.email !== req.params.participantEmail
    );

    await event.save();

    res.json({
      success: true,
      message: "Participant removed successfully",
      data: event
    });
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).json({ message: "Failed to delete participant", error: error.message });
  }
});
// Admin deletes a participation request
router.delete("/participation-requests/:id", async (req, res) => {
  try {
    const EventParticipation = require("../models/EventParticipation");

    const participation = await EventParticipation.findByIdAndDelete(req.params.id);

    if (!participation) {
      return res.status(404).json({ message: "Participation request not found" });
    }

    res.json({
      success: true,
      message: "Participation request deleted successfully",
      data: participation
    });
  } catch (error) {
    console.error("Error deleting participation:", error);
    res.status(500).json({ message: "Failed to delete participation", error: error.message });
  }
});

module.exports = router;