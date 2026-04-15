const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const PlacementTrend = require("../models/PlacementTrend");
const PlacementStat = require("../models/PlacementStat");
const PlacedStudent = require("../models/PlacedStudent");
const User = require("../models/User");

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

// Admin: Create new placement drive
router.post("/drives", verifyToken, async (req, res) => {
    try {
        const { company, role, branch, package: pkg, date, link } = req.body;

        if (!company || !role || !pkg || !date) {
            return res.status(400).json({ message: "Missing required fields: company, role, package, date" });
        }

        const newDrive = new PlacementDrive({
            company,
            role,
            branch: branch || "All",
            package: pkg,
            date,
            link: link || ""
        });

        const savedDrive = await newDrive.save();
        res.status(201).json(savedDrive);
    } catch (err) {
        console.error("Error creating placement drive:", err);
        res.status(500).json({ message: "Failed to create placement drive", error: err.message });
    }
});

// Admin: Update placement drive
router.put("/drives/:id", verifyToken, async (req, res) => {
    try {
        const { company, role, branch, package: pkg, date, link } = req.body;

        if (!company || !role || !pkg || !date) {
            return res.status(400).json({ message: "Missing required fields: company, role, package, date" });
        }

        const updatedDrive = await PlacementDrive.findByIdAndUpdate(
            req.params.id,
            {
                company,
                role,
                branch: branch || "All",
                package: pkg,
                date,
                link: link || ""
            },
            { new: true }
        );

        if (!updatedDrive) {
            return res.status(404).json({ message: "Drive not found" });
        }

        res.json(updatedDrive);
    } catch (err) {
        console.error("Error updating placement drive:", err);
        res.status(500).json({ message: "Failed to update placement drive", error: err.message });
    }
});

// Admin: Delete placement drive
router.delete("/drives/:id", verifyToken, async (req, res) => {
    try {
        const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
        if (!drive) {
            return res.status(404).json({ message: "Drive not found" });
        }
        res.json({ message: "Drive deleted successfully", drive });
    } catch (err) {
        console.error("Error deleting placement drive:", err);
        res.status(500).json({ message: "Failed to delete placement drive", error: err.message });
    }
});

// Admin: Create new placed student
router.post("/placed-students", verifyToken, async (req, res) => {
    try {
        const { enrollmentNo, name, branch, company, package: pkg } = req.body;

        if (!enrollmentNo || !name || !branch || !company || !pkg) {
            return res.status(400).json({ message: "Missing required fields: enrollmentNo, name, branch, company, package" });
        }

        // Check if student is registered in the system
        const registeredUser = await User.findOne({ enrollmentNumber: enrollmentNo });
        if (!registeredUser) {
            return res.status(404).json({ message: `Student with enrollment number ${enrollmentNo} is not registered in the system. Please check the enrollment number.` });
        }

        // Check if student already exists in placed students list
        const existingStudent = await PlacedStudent.findOne({ enrollmentNo });
        if (existingStudent) {
            return res.status(409).json({ message: `Student with enrollment number ${enrollmentNo} is already in the placed students list.` });
        }

        const newPlacedStudent = new PlacedStudent({
            enrollmentNo,
            name,
            branch,
            company,
            package: pkg
        });

        const savedStudent = await newPlacedStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        console.error("Error creating placed student:", err);
        res.status(500).json({ message: "Failed to create placed student", error: err.message });
    }
});

// Admin: Update placed student
router.put("/placed-students/:id", verifyToken, async (req, res) => {
    try {
        const { enrollmentNo, name, branch, company, package: pkg } = req.body;

        if (!enrollmentNo || !name || !branch || !company || !pkg) {
            return res.status(400).json({ message: "Missing required fields: enrollmentNo, name, branch, company, package" });
        }

        // Check if student is registered in the system
        const registeredUser = await User.findOne({ enrollmentNumber: enrollmentNo });
        if (!registeredUser) {
            return res.status(404).json({ message: `Student with enrollment number ${enrollmentNo} is not registered in the system. Please check the enrollment number.` });
        }

        // Check if enrollment number is already used by another placed student (if changing enrollment number)
        const currentStudent = await PlacedStudent.findById(req.params.id);
        if (currentStudent && currentStudent.enrollmentNo !== enrollmentNo) {
            const existingStudent = await PlacedStudent.findOne({ enrollmentNo });
            if (existingStudent) {
                return res.status(409).json({ message: `Student with enrollment number ${enrollmentNo} is already in the placed students list.` });
            }
        }

        const updatedStudent = await PlacedStudent.findByIdAndUpdate(
            req.params.id,
            {
                enrollmentNo,
                name,
                branch,
                company,
                package: pkg
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Placed student not found" });
        }

        res.json(updatedStudent);
    } catch (err) {
        console.error("Error updating placed student:", err);
        res.status(500).json({ message: "Failed to update placed student", error: err.message });
    }
});

// Admin: Delete placed student
router.delete("/placed-students/:id", verifyToken, async (req, res) => {
    try {
        const student = await PlacedStudent.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully", student });
    } catch (err) {
        console.error("Error deleting placed student:", err);
        res.status(500).json({ message: "Failed to delete placed student", error: err.message });
    }
});

// Admin: Create new placement trend
router.post("/trends", verifyToken, async (req, res) => {
    try {
        const { year, avg, companies } = req.body;

        if (!year || !avg || !companies) {
            return res.status(400).json({ message: "Missing required fields: year, avg, companies" });
        }

        const newTrend = new PlacementTrend({
            year: parseInt(year),
            avg: parseFloat(avg),
            companies: parseInt(companies)
        });

        const savedTrend = await newTrend.save();
        res.status(201).json(savedTrend);
    } catch (err) {
        console.error("Error creating placement trend:", err);
        res.status(500).json({ message: "Failed to create placement trend", error: err.message });
    }
});

// Admin: Update placement trend
router.put("/trends/:id", verifyToken, async (req, res) => {
    try {
        const { year, avg, companies } = req.body;

        if (!year || !avg || !companies) {
            return res.status(400).json({ message: "Missing required fields: year, avg, companies" });
        }

        const updatedTrend = await PlacementTrend.findByIdAndUpdate(
            req.params.id,
            {
                year: parseInt(year),
                avg: parseFloat(avg),
                companies: parseInt(companies)
            },
            { new: true }
        );

        if (!updatedTrend) {
            return res.status(404).json({ message: "Trend not found" });
        }

        res.json(updatedTrend);
    } catch (err) {
        console.error("Error updating placement trend:", err);
        res.status(500).json({ message: "Failed to update placement trend", error: err.message });
    }
});

// Admin: Delete placement trend
router.delete("/trends/:id", verifyToken, async (req, res) => {
    try {
        const trend = await PlacementTrend.findByIdAndDelete(req.params.id);
        if (!trend) {
            return res.status(404).json({ message: "Trend not found" });
        }
        res.json({ message: "Trend deleted successfully", trend });
    } catch (err) {
        console.error("Error deleting placement trend:", err);
        res.status(500).json({ message: "Failed to delete placement trend", error: err.message });
    }
});

module.exports = router;
