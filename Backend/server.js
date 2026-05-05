// server.js

// const dns = require("node:dns");
// dns.setServers(['8.8.8.8', '8.8.4.4'])
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const placementRoutes = require("./routes/placementRoutes");
const eventRoutes = require("./routes/eventRoutes");
const clubRoutes = require("./routes/clubs");
const app = express();
app.use(express.json());
app.use(cors());
// app.use("/uploads", express.static("uploads"));

const scholarshipRoutes = require("./routes/scholarshipRoutes");
const feedRoutes = require("./routes/feedRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const complaintRoutes = require("./routes/complaintRoute");
const lostFoundRoutes = require("./routes/lostFoundRoutes");




// mongoose.connect("mongodb://127.0.0.1:27017/alumniDB");
mongoose.connect("mongodb+srv://gujarrajendra015_db_user:project1020@cluster0.nehqfmw.mongodb.net/test?appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    // Initialize Event Reminder Scheduler
    try {
      const { initEventReminderScheduler } = require("./utils/eventScheduler");
      initEventReminderScheduler();
    } catch (error) {
      console.error("❌ Failed to initialize event reminder scheduler:", error);
    }

    // Drop the unique index on PlacedStudent.enrollmentNo if it exists
    try {
      const PlacedStudent = require("./models/PlacedStudent");
      const indexes = await PlacedStudent.collection.getIndexes();
      if (indexes.enrollmentNo_1) {
        await PlacedStudent.collection.dropIndex("enrollmentNo_1");
        console.log("✓ Dropped unique index on enrollmentNo");
      }
    } catch (err) {
      // Silently handle any errors
      if (err.message && !err.message.includes("ns not found")) {
        console.log("Index check result:", err.message);
      }
    }
  })
  .catch((err) => { console.error("Error connecting to MongoDB Atlas:", err) });

// const User = require("./models/User");
const Alumni = require("./models/Alumni");
// const Admin = require("./models/Admin");
console.log("API KEY:", process.env.OPENROUTER_API_KEY);



// API to get alumni
app.get("/alumni", async (req, res) => {
  const data = await Alumni.find();
  res.json(data);
});

app.use("/api/auth", authRoutes);
app.use("/admin", userRoutes);
app.use("/api/placements", placementRoutes);
// app.use("/api/admin", adminRoutes);
app.use("/images", require("express").static("images"));
app.use("/uploads", express.static("uploads"));
app.use("/alumniimage", express.static("alumniimage"));
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/lost-found", lostFoundRoutes);










app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
