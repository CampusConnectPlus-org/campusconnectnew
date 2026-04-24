const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/Upload"); // 👈 agar already hai to ok
console.log("AUTH ROUTES LOADED ✅");
router.get("/test", (req, res) => {
    res.send("Auth working ✅");
});
// ADD ADMIN API
router.post("/addAdmin", upload.single("profileImage"), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check duplicate
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create admin
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: role || "admin",
            profileImage: req.file ? req.file.path : "",
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: newAdmin,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
        });
    }
});

// admin login api
router.post("/admin", async (req, res) => {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
        return res.json({ message: "admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
        {
            id: admin._id,
            role: admin.role
        },
        "secretkey",
        { expiresIn: "1d" }
    );

    res.json({
        token,
        admin: {
            name: admin.name,
            email: admin.email,
            profileImage: admin.profileImage,
            role: admin.role
        }
    });

});
// LOGIN API
router.post("/login", async (req, res) => {

    const { enrollmentNumber, password } = req.body;

    // console.log(`Login attempt for enrollment: ${enrollmentNumber}`);

    const user = await User.findOne({ enrollmentNumber });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    // console.log(`User ID for enrollment ${enrollmentNumber}: ${user._id}`);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        "secretkey",
        { expiresIn: "1d" }
    );

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            enrollmentNumber: user.enrollmentNumber,
            email: user.email,
            profileImage: user.profileImage
        }
    });

});



module.exports = router;