const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const PlacementTrend = require("../models/PlacementTrend");
const PlacementStat = require("../models/PlacementStat");
const PlacedStudent = require("../models/PlacedStudent");

router.get("/drives", async (req, res) => {
    try {
        const drives = await PlacementDrive.find().sort({ date: 1 });
        res.json(drives);
    } catch (err) {
        console.error("Error fetching placement drives:", err);
        res.status(500).json({ message: "Failed to load placement drives" });
    }
});

router.get("/stats", async (req, res) => {
    try {
        const stats = await PlacementStat.findOne();
        res.json(stats || {});
    } catch (err) {
        console.error("Error fetching placement stats:", err);
        res.status(500).json({ message: "Failed to load placement stats" });
    }
});

router.get("/trends", async (req, res) => {
    try {
        const trends = await PlacementTrend.find().sort({ year: 1 });
        res.json(trends);
    } catch (err) {
        console.error("Error fetching placement trends:", err);
        res.status(500).json({ message: "Failed to load placement trends" });
    }
});

router.get("/placed-students", async (req, res) => {
    try {
        const placedStudents = await PlacedStudent.find().sort({ name: 1 });
        res.json(placedStudents);
    } catch (err) {
        console.error("Error fetching placed students:", err);
        res.status(500).json({ message: "Failed to load placed students" });
    }
});

// const sampleDrives = [
//     { company: "Microsoft", role: "Software Engineer", branch: "CSE/IT", package: "44 LPA", date: "25 Apr", link: "https://forms.gle/example1" },
//     { company: "L&T", role: "Graduate Engineer", branch: "Civil/Mech", package: "6.5 LPA", date: "28 Apr", link: "https://forms.gle/example2" },
//     { company: "Adobe", role: "Product Intern", branch: "All", package: "12 LPA", date: "02 May", link: "https://forms.gle/example3" }
// ];

// const samplePlacedStudents = [
//     { name: "Sakshi Soni", branch: "CSE", company: "In Time Tec", package: "5.5 LPA" },
//     { name: "Rahul Sharma", branch: "IT", company: "TCS", package: "7.0 LPA" },
//     { name: "Priya Verma", branch: "ECE", company: "Infosys", package: "9.5 LPA" }
// ];

// const sampleStats = {
//     highestPackage: "48.5 LPA",
//     averagePackage: "9.2 LPA",
//     totalCompanies: "120+",
//     placementRate: "94%"
// };

// const sampleTrends = [
//     { year: "2023", avg: 7.5, companies: 95 },
//     { year: "2024", avg: 8.2, companies: 110 },
//     { year: "2025", avg: 9.2, companies: 125 }
// ];

// const sampleApplications = (userId) => [
//     { user: userId, company: "Google", role: "SDE Intern", status: "Shortlisted", date: "12 Mar" },
//     { user: userId, company: "TCS", role: "Ninja Developer", status: "Selected", date: "05 Mar" }
// ];

// a temporary route to seed sample placement data for testing purposes

// router.post("/seed-sample-data", async (req, res) => {
//     const { userId } = req.body;

//     if (!userId) {
//         return res.status(400).json({ message: "Missing userId in request body. Provide a valid userId to seed application history." });
//     }

//     try {
//         await PlacementDrive.deleteMany({});
//         await PlacementStat.deleteMany({});
//         await PlacementTrend.deleteMany({});
//         await PlacedStudent.deleteMany({});
//         await Application.deleteMany({ user: userId });

//         const createdDrives = await PlacementDrive.insertMany(sampleDrives);
//         const createdStats = await PlacementStat.create(sampleStats);
//         const createdTrends = await PlacementTrend.insertMany(sampleTrends);
//         const createdPlacedStudents = await PlacedStudent.insertMany(samplePlacedStudents);
//         const createdApplications = await Application.insertMany(sampleApplications(userId));

//         res.json({
//             message: "Sample placement data inserted successfully.",
//             drivesInserted: createdDrives.length,
//             statsInserted: createdStats ? 1 : 0,
//             trendsInserted: createdTrends.length,
//             placedStudentsInserted: createdPlacedStudents.length,
//             applicationsInserted: createdApplications.length
//         });
//     } catch (err) {
//         console.error("Error seeding sample placement data:", err);
//         res.status(500).json({ message: "Failed to seed sample placement data" });
//     }
// });

router.get("/applications", verifyToken, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).sort({ date: -1 });
        res.json(applications);
    } catch (err) {
        console.error("Error fetching user applications:", err);
        res.status(500).json({ message: "Failed to load applications" });
    }
});

module.exports = router;
